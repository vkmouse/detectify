import { useEffect, useReducer, useRef, useState } from 'react';
import styled from 'styled-components';
import Canvas from '../../components/Canvas';
import ImageCardCollection from '../../components/ImageCardCollection';
import { useAnnotation } from '../../context/AnnotationContext';
import { useProjectInfo } from '../../context/ProjectInfoContext';
import annotationReducer, {
  labelEnd,
  labelMove,
  labelStart,
} from '../../reducers/annotateReducer';
import { BatchUploadResponse } from '../../types/api';
import { Rect } from '../../types/types';
import { resizeCanvasAndCallCallback } from '../../utils/canvasUtils';
import { ImageDrawer, ImageScaler } from '../../utils/ImageDrawer';
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
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const scalerRef = useRef<ImageScaler>(new ImageScaler());
  const drawerRef = useRef<ImageDrawer | null>(null);
  const roiRef = useRef<Rect | null>(null);
  const { images } = useProjectInfo();
  const { select, selected: bboxes } = useAnnotation();
  const [open, setOpen] = useState(false);
  const [state, dispatch] = useReducer(annotationReducer, {
    initialLocation: null,
    labelingRoi: null,
  });

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

  const handleCanvasMouseUp = ({ x, y }: { x: number; y: number }) => {
    roiRef.current = state.labelingRoi;
    dispatch(labelEnd({ x, y }));
    setOpen(true);
  };

  const handleCardClick = (
    img: HTMLImageElement,
    { annotationURL }: BatchUploadResponse
  ) => {
    // request to update annotation
    select(annotationURL);

    // update image
    drawerRef.current?.setImage(img);

    // update scaler
    const scaler = scalerRef.current;
    scaler.setImageSize(img.naturalWidth, img.naturalHeight);
    scaler.autoScale(1);
  };

  useEffect(() => {
    // update bboxes
    drawerRef.current?.clearBboxes();
    for (const box of bboxes) {
      drawerRef.current?.pushBbox(box);
    }

    // repaint
    drawerRef.current?.draw();
  }, [bboxes]);

  useEffect(() => {
    // initial drawer
    resizeCanvasAndCallCallback(canvasRef?.current, (ctx) => {
      drawerRef.current = new ImageDrawer(ctx, scalerRef.current);
    });
  }, []);

  useEffect(() => {
    // repaint when labeling change
    if (state.labelingRoi) {
      const { x, y, width, height } = state.labelingRoi;
      drawerRef.current?.draw();
      drawerRef.current?.drawRect(x, y, width, height);
    }
  }, [state.labelingRoi]);

  return (
    <>
      <InputModal
        open={open}
        onClose={() => setOpen(false)}
        onSuccess={(category) => {
          if (roiRef.current && category) {
            // append to annotation context

            // append to drawer and repaint
            drawerRef.current?.pushBbox({
              ...roiRef.current,
              name: category,
              confidence: 1.0,
            });
            drawerRef.current?.draw();
          }
          roiRef.current = null;
        }}
        onCancel={() => {
          roiRef.current = null;
          drawerRef.current?.draw();
        }}
      />
      <Container>
        <CanvasWrapper>
          <CustomCanvas
            ref={canvasRef}
            onPaint={(_, w, h) => {
              const scaler = scalerRef.current;
              scaler.setPaintSize(w, h);
              scaler.autoScale(1);
              drawerRef.current?.draw();
            }}
            onMouseDown={(e) => handleCanvasMouseDown(convertToCoordinates(e))}
            onMouseMove={(e) => handleCanvasMouseMove(convertToCoordinates(e))}
            onMouseUp={(e) => handleCanvasMouseUp(convertToCoordinates(e))}
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
