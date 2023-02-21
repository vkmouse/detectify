import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import Canvas from '../../components/Canvas';
import ImageCardCollection from '../../components/ImageCardCollection';
import { useAnnotation } from '../../context/AnnotationContext';
import { useProjectInfo } from '../../context/ProjectInfoContext';
import { BatchUploadResponse } from '../../types/api';
import { resizeCanvasAndCallCallback } from '../../utils/canvasUtils';
import { ImageDrawer, ImageScaler } from '../../utils/ImageDrawer';
import { Card } from '../ProjectsPage/styles';

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
  const { images } = useProjectInfo();
  const { select, selected: bboxes } = useAnnotation();

  const convertToCoordinates = (
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    const canvas = e.target as HTMLCanvasElement;
    const rect = canvas.getBoundingClientRect();
    const canvasX = e.clientX - rect.left;
    const canvasY = e.clientY - rect.top;
    const [imageX, imageY] = scalerRef.current.paintToImage(canvasX, canvasY);
    return { canvasX, canvasY, imageX, imageY };
  };

  const handleCanvasMouseDown = ({
    canvasX,
    canvasY,
    imageX,
    imageY,
  }: {
    canvasX: number;
    canvasY: number;
    imageX: number;
    imageY: number;
  }) => {
    console.log([canvasX, canvasY, imageX, imageY]);
  };

  const handleCanvasMouseMove = ({
    canvasX,
    canvasY,
    imageX,
    imageY,
  }: {
    canvasX: number;
    canvasY: number;
    imageX: number;
    imageY: number;
  }) => {
    console.log([canvasX, canvasY, imageX, imageY]);
  };

  const handleCanvasMouseUp = ({
    canvasX,
    canvasY,
    imageX,
    imageY,
  }: {
    canvasX: number;
    canvasY: number;
    imageX: number;
    imageY: number;
  }) => {
    console.log([canvasX, canvasY, imageX, imageY]);
  };

  const draw = () => {
    if (!drawerRef.current) {
      return;
    }
    drawerRef.current.draw();
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
    resizeCanvasAndCallCallback(canvasRef?.current, draw);
  }, [bboxes]);

  useEffect(() => {
    // initial drawer
    resizeCanvasAndCallCallback(canvasRef?.current, (ctx) => {
      drawerRef.current = new ImageDrawer(ctx, scalerRef.current);
    });
  }, []);

  return (
    <Container>
      <CanvasWrapper>
        <CustomCanvas
          ref={canvasRef}
          onPaint={(_, w, h) => {
            const scaler = scalerRef.current;
            scaler.setPaintSize(w, h);
            scaler.autoScale(1);
            draw();
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
  );
};

export default AnnotatePage;
