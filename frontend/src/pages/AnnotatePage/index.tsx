import { useRef } from 'react';
import styled from 'styled-components';
import Canvas from '../../components/Canvas';
import ImageCardCollection from '../../components/ImageCardCollection';
import { useProjectInfo } from '../../context/ProjectInfoContext';
import { BatchUploadResponse } from '../../types/api';
import { resizeCanvasAndCallCallback } from '../../utils/canvasUtils';
import ImageScaler from '../../utils/ImageScale';
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
  const { images } = useProjectInfo();
  const selectedRef = useRef<{
    img: HTMLImageElement;
    annotationURL: string;
  } | null>(null);
  const scalarRef = useRef<ImageScaler>(new ImageScaler());

  const convertToCoordinates = (
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    const canvas = e.target as HTMLCanvasElement;
    const rect = canvas.getBoundingClientRect();
    const canvasX = e.clientX - rect.left;
    const canvasY = e.clientY - rect.top;
    const [imageX, imageY] = scalarRef.current.paintToImage(canvasX, canvasY);
    return { canvasX, canvasY, imageX, imageY };
  };

  const handleCanvasPaint = (
    ctx: CanvasRenderingContext2D,
    canvasWidth: number,
    canvasHeight: number
  ) => {
    if (selectedRef.current) {
      const { img } = selectedRef.current;
      scalarRef.current.setPaintAndImageSizes(
        canvasWidth,
        canvasHeight,
        img.naturalWidth,
        img.naturalHeight
      );
      scalarRef.current.autoScale();
      if (scalarRef.current.getScale() > 1) {
        scalarRef.current.setScale(1);
      }
      const [x, y, width, height] = scalarRef.current.imageToPaintRect(
        0,
        0,
        img.naturalWidth,
        img.naturalHeight
      );
      ctx.drawImage(img, x, y, width, height);
    }
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

  const handleCardClick = (
    img: HTMLImageElement,
    { annotationURL }: BatchUploadResponse
  ) => {
    selectedRef.current = { img, annotationURL };
    resizeCanvasAndCallCallback(canvasRef?.current, handleCanvasPaint);
  };

  return (
    <Container>
      <CanvasWrapper>
        <CustomCanvas
          ref={canvasRef}
          onPaint={handleCanvasPaint}
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
