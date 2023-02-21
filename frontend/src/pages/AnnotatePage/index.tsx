import { useReducer, useRef, useState } from 'react';
import styled from 'styled-components';
import Canvas from '../../components/Canvas';
import ImageCardCollection from '../../components/ImageCardCollection';
import { useAnnotation } from '../../context/AnnotationContext';
import { useProjectInfo } from '../../context/ProjectInfoContext';
import useImageDrawer from '../../hooks/useImageDrawer';
import annotationReducer, {
  labelEnd,
  labelMove,
  labelStart,
} from '../../reducers/annotateReducer';
import { BatchUploadResponse } from '../../types/api';
import { ImageScaler } from '../../utils/ImageDrawer';
import { Card } from '../ProjectsPage/styles';
import InputModal from './InputModal';

const Container = styled.div`
  display: grid;
  grid-template-columns: 80% 20%;
`;

const CanvasWrapper = styled(Card)`
  position: relative;
  width: 100%;
  height: 0;
  padding-top: 75%;
  cursor: crosshair;
`;

const CustomCanvas = styled(Canvas)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const ImageCollectionContainer = styled.div`
  display: flex;
  position: relative;
  padding-left: calc(100% - 5px);
  padding-top: 100%;
  margin-left: 5px;
`;

const AnnotatePage = () => {
  const scalerRef = useRef<ImageScaler>(new ImageScaler());
  const { images } = useProjectInfo();
  const { bboxes, select, pushBbox } = useAnnotation();
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [open, setOpen] = useState(false);
  const [state, dispatch] = useReducer(annotationReducer, {
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
    { annotationURL }: BatchUploadResponse
  ) => {
    select(annotationURL);
    setImg(img);
  };

  return (
    <>
      <InputModal
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
        <ImageCollectionContainer>
          <ImageCardCollection
            images={images.filter((p) => p.annotationURL.includes('.xml'))}
            onImageCardClick={handleCardClick}
          />
        </ImageCollectionContainer>
      </Container>
    </>
  );
};

export default AnnotatePage;
