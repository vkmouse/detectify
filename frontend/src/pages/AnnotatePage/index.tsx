import axios from 'axios';
import { useReducer, useRef, useState } from 'react';
import styled from 'styled-components';
import api from '../../api/api';
import { PrimaryButton } from '../../components/Button';
import Canvas from '../../components/Canvas';
import { Card } from '../../components/Card';
import ImageCardCollection from '../../components/ImageCardCollection';
import { useAnnotation } from '../../context/AnnotationContext';
import { useProjectInfo } from '../../context/ProjectInfoContext';
import useImageDrawer from '../../hooks/useImageDrawer';
import labelingReducer, {
  labelEnd,
  labelMove,
  labelStart,
} from '../../reducers/labelingReducer';
import { BatchUploadResponse } from '../../types/api';
import { ImageScaler } from '../../utils/ImageDrawer';
import InputModal from './InputModal';

const Container = styled.div`
  display: grid;
  grid-template-columns: 80% 20%;
  column-gap: 10px;
  row-gap: 10px;
  margin-right: 10px;
  @media (max-width: 600px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;

const CanvasWrapper = styled(Card)`
  position: relative;
  width: 100%;
  height: 0;
  padding-top: 66.67%;
  cursor: crosshair;
`;

const CustomCanvas = styled(Canvas)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const AnnotatePage = () => {
  const scalerRef = useRef<ImageScaler>(new ImageScaler());
  const { id: projectId, images } = useProjectInfo();
  const { categoryList, bboxes, generateAnnotation, select, pushBbox } =
    useAnnotation();
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [open, setOpen] = useState(false);
  const [state, dispatch] = useReducer(labelingReducer, {
    initialLocation: null,
    labelingRoi: null,
  });
  const canvasRef = useImageDrawer(
    bboxes,
    state.labelingRoi,
    img,
    scalerRef.current
  );

  const convertToCoordinates = (
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    const canvas = e.target as HTMLCanvasElement;
    const rect = canvas.getBoundingClientRect();
    const canvasX = e.clientX - rect.left;
    const canvasY = e.clientY - rect.top;
    const [imageX, imageY] = scalerRef.current.paintToImage(canvasX, canvasY);
    const { width, height } = scalerRef.current.getImageSize();
    return {
      x: Math.min(Math.max(imageX, 0), width),
      y: Math.min(Math.max(imageY, 0), height),
    };
  };

  const handleCanvasMouseDown = ({ x, y }: { x: number; y: number }) => {
    dispatch(labelStart({ x, y }));
  };

  const handleCanvasMouseMove = ({ x, y }: { x: number; y: number }) => {
    dispatch(labelMove({ x, y }));
  };

  const handleCardClick = (
    img: HTMLImageElement,
    { filename, annotationURL }: BatchUploadResponse
  ) => {
    select(filename, annotationURL, img.naturalWidth, img.naturalHeight);
    setImg(img);
  };

  const handleSaveClick = async () => {
    const xmls = generateAnnotation();
    const uploadedFiles = xmls.map((p) => ({
      filename: p.filename,
      imageExt: '',
      annotationExt: '.xml',
    }));

    const resp = await api.createBatchUpload({
      projectId,
      uploadedFiles,
    });

    for (const xml of xmls) {
      const presignedURL = resp.get(xml.filename)?.annotationURL;
      if (presignedURL) {
        const blob = new Blob([xml.xml], { type: 'text/xml' });
        const file = new File([blob], xml.filename, {
          type: 'text/xml',
        });
        await axios.put(presignedURL, file, {
          headers: { 'Content-Type': 'text/xml' },
        });
      }
    }
  };

  return (
    <>
      <InputModal
        categoryList={categoryList}
        open={open}
        onClose={() => setOpen(false)}
        onSuccess={(category) => {
          if (state.labelingRoi) {
            const box = {
              ...state.labelingRoi,
              name: category,
              confidence: 1.0,
            };
            pushBbox(box);
          }
          dispatch(labelEnd());
        }}
        onCancel={() => {
          dispatch(labelEnd());
        }}
      />
      <Container>
        <CanvasWrapper>
          <CustomCanvas
            ref={canvasRef}
            onMouseDown={(e) => handleCanvasMouseDown(convertToCoordinates(e))}
            onMouseMove={(e) => handleCanvasMouseMove(convertToCoordinates(e))}
            onMouseUp={() => setOpen(true)}
          />
        </CanvasWrapper>
        <ImageCardCollection
          images={images}
          onImageCardClick={handleCardClick}
        />
        <div />
        <PrimaryButton onClick={handleSaveClick}>Save</PrimaryButton>
      </Container>
    </>
  );
};

export default AnnotatePage;
