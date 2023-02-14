import { useQuery } from '@tanstack/react-query';
import React, { useRef, useState } from 'react';
import api from '../../api/api';
import InputGroup from './InputGroup';
import PreviewCanvas from '../../components/PreviewCanvas';
import styled from 'styled-components';
import { drawBoundingBoxes } from '../../utils/canvasUtils';
import { useProjectInfo } from '../../context/ProjectInfoContext';

type Size = {
  width: number;
  height: number;
};

const Container = styled.div`
  display: grid;
  grid-template-columns: 80% 20%;
`;

const PredictPage = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const currImageURL = useRef('');
  const thresholdRef = useRef(0.5);
  const [displayRegion, setDisplayRegion] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const [displayRadio, setDisplayRadio] = useState(1.0);
  const { irModel } = useProjectInfo();

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
    setDisplayRegion({ x, y, width, height });
    setDisplayRadio(ratio);
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

  const inferQuery = useQuery({
    queryKey: ['infer'],
    queryFn: async () =>
      api.infer({
        modelURL: irModel,
        imageURL: currImageURL.current,
        threshold: thresholdRef.current,
      }),
    onSuccess: (boundingBoxes) => {
      if (boundingBoxes && canvasRef.current && currImageURL.current) {
        drawBoundingBoxes(
          canvasRef.current,
          displayRegion,
          displayRadio,
          boundingBoxes
        );
      }
    },
    enabled: false,
  });

  return (
    <Container>
      <PreviewCanvas ref={canvasRef} isLoading={inferQuery.isFetching} />
      <InputGroup
        disabled={currImageURL.current === '' || inferQuery.isFetching}
        onImageCardClick={(img) => {
          currImageURL.current = img.src;
          drawCanvas(img);
        }}
        onDetectionClick={(threshold) => {
          thresholdRef.current = threshold;
          inferQuery.refetch();
        }}
      />
    </Container>
  );
};

export default PredictPage;
