import { useQuery } from '@tanstack/react-query';
import React, { useRef, useState } from 'react';
import api from '../../api/api';
import { InferResponse } from '../../types/api';
import InputGruop from './InputGroup';
import PreviewCanvas from './PreviewCanvas';
import styled from 'styled-components';

type Size = {
  width: number;
  height: number;
};

const Container = styled.div`
  display: grid;
  grid-template-columns: 80% 20%;
`;

const drawRect = (
  context: CanvasRenderingContext2D,
  name: string,
  x: number,
  y: number,
  width: number,
  height: number
) => {
  const fontSize = 18;
  const color = '#FF0000';
  context.font = `${fontSize}px Microsoft YaHei`;
  context.strokeStyle = color;
  context.fillStyle = color;
  context.lineWidth = 3;

  context.beginPath();
  context.rect(x, y, width, height);
  context.stroke();

  const labelName = name;
  const { width: textWidth } = context.measureText(labelName);
  context.fillStyle = color;
  context.fillRect(
    x - context.lineWidth / 2,
    y - fontSize - context.lineWidth / 2,
    textWidth + context.lineWidth,
    fontSize + context.lineWidth
  );
  context.fillStyle = '#fff';
  context.fillText(labelName, x, y - context.lineWidth / 2);
};

const ModelPage = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const currImageURL = useRef('');
  const thresholdRef = useRef(0.5);
  const [rect, setRect] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    ratio: 1.0,
  });

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
    setRect({ x, y, width, height, ratio });
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

  const drawBoundingBoxes = (boundingBoxes: InferResponse[]) => {
    if (boundingBoxes && currImageURL.current) {
      const canvas = canvasRef.current;
      const context = canvas?.getContext('2d');
      if (canvas && context) {
        for (const box of boundingBoxes) {
          const x = rect.x + box.x * rect.ratio;
          const y = rect.y + box.y * rect.ratio;
          const width = box.width * rect.ratio;
          const height = box.height * rect.ratio;
          const name = box.name;
          drawRect(context, name, x, y, width, height);
        }
      }
    }
  };

  const inferQuery = useQuery({
    queryKey: ['infer'],
    queryFn: async () =>
      api.infer({
        modelURL:
          'https://pub-524340b28b994541ba4d1f39e64d2b3d.r2.dev/ssd320.zip',
        imageURL: currImageURL.current,
        threshold: thresholdRef.current,
      }),
    onSuccess: drawBoundingBoxes,
    enabled: false,
  });

  return (
    <Container>
      <PreviewCanvas ref={canvasRef} isLoading={inferQuery.isFetching} />
      <InputGruop
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

export default ModelPage;
