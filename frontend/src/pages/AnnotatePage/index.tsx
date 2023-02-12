import axios from 'axios';
import { useRef } from 'react';
import styled from 'styled-components';
import ImageCardCollection from '../../components/ImageCardCollection';
import PreviewCanvas from '../../components/PreviewCanvas';
import { useProjectInfo } from '../../context/ProjectInfoContext';
import { BatchUploadResponse } from '../../types/api';
import { drawBoundingBoxes } from '../../utils/canvasUtils';

const Container = styled.div`
  display: grid;
  grid-template-columns: 80% 20%;
`;

const ImageCollectionContainer = styled.div`
  display: flex;
  position: relative;
  padding-left: calc(100% - 5px);
  padding-top: 100%;
  margin-left: 5px;
`;

type Size = {
  width: number;
  height: number;
};

const AnnotatePage = () => {
  const { images } = useProjectInfo();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const displayRegion = useRef({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const displayRadio = useRef(1.0);

  const updateRect = (canvasSize: Size, size: Size) => {
    let { width, height } = size;
    let ratio = 1.0;
    if (canvasSize.width < width || canvasSize.height < height) {
      ratio = Math.min(canvasSize.width / width, canvasSize.height / height);
      width = width * ratio;
      height = height * ratio;
    }
    const x = (canvasSize.width - width) / 2;
    const y = (canvasSize.height - height) / 2;
    displayRegion.current = { x, y, width, height };
    displayRadio.current = ratio;
    return { x, y, width, height };
  };

  const drawCanvas = (image: HTMLImageElement) => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (canvas && context) {
      const canvasSize = { width: canvas.width, height: canvas.height };
      const size = { width: image.naturalWidth, height: image.naturalHeight };
      const { x, y, width, height } = updateRect(canvasSize, size);
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, x, y, width, height);
    }
  };

  const handleCardClick = (
    img: HTMLImageElement,
    { annotationURL }: BatchUploadResponse
  ) => {
    drawCanvas(img);
    axios.get(annotationURL).then(({ data: xml }) => {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xml, 'text/xml');

      const objects = xmlDoc.getElementsByTagName('object');
      const boundingBoxes = [];

      for (let i = 0; i < objects.length; i++) {
        const name = objects[i].getElementsByTagName('name')[0].textContent;
        const bndbox = objects[i].getElementsByTagName('bndbox')[0];
        const xmin = bndbox.getElementsByTagName('xmin')[0].textContent;
        const ymin = bndbox.getElementsByTagName('ymin')[0].textContent;
        const xmax = bndbox.getElementsByTagName('xmax')[0].textContent;
        const ymax = bndbox.getElementsByTagName('ymax')[0].textContent;
        if (xmin !== null && xmax !== null && ymin !== null && ymax !== null) {
          boundingBoxes.push({
            name: name === null ? '' : name,
            confidence: 1,
            height: parseInt(xmax) - parseInt(xmin),
            width: parseInt(ymax) - parseInt(ymin),
            x: parseInt(xmin),
            y: parseInt(ymin),
          });
        }
      }

      if (boundingBoxes && canvasRef.current) {
        drawBoundingBoxes(
          canvasRef.current,
          displayRegion.current,
          displayRadio.current,
          boundingBoxes
        );
      }
    });
  };

  return (
    <Container>
      <PreviewCanvas ref={canvasRef} isLoading={false} />
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
