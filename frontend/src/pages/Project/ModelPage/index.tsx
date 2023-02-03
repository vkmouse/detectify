import React, { useEffect, useRef, useState } from 'react';
import api from '../../../api/api';
import { PrimaryButton } from '../../../components/Button';
import ImageCard from '../../../components/ImageCard';
import { useProjectInfo } from '../../../context/ProjectInfoContext';
import { InferResponse } from '../../../types/api';
import {
  CanvasInnerWrapper,
  CanvasWrapper,
  HotizentalImageList,
  ImageCardContainer,
} from './styles';

type Size = {
  width: number;
  height: number;
};

const Canvas = React.forwardRef<HTMLCanvasElement>(({}, ref) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<Size>({ width: 0, height: 0 });

  useEffect(() => {
    if (divRef.current) {
      setSize({
        width: divRef.current?.clientWidth,
        height: divRef.current?.clientHeight,
      });
    }
  }, [divRef.current?.clientWidth, divRef.current?.clientHeight]);

  return (
    <div ref={divRef} style={{ width: '100%', height: '100%' }}>
      <canvas ref={ref} {...size} />
    </div>
  );
});

Canvas.displayName = 'Canvas';

const ModelPage = () => {
  const { images } = useProjectInfo();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const currImageURL = useRef('');
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
      console.log(boundingBoxes);
      const canvas = canvasRef.current;
      const context = canvas?.getContext('2d');
      if (canvas && context) {
        for (const box of boundingBoxes) {
          const x = rect.x + box.x * rect.ratio;
          const y = rect.y + box.y * rect.ratio;
          const width = box.width * rect.ratio;
          const height = box.height * rect.ratio;
          context.strokeStyle = '#FF0000';
          context.beginPath();
          context.rect(x, y, width, height);
          context.stroke();
        }
      }
    }
  };

  return (
    <>
      <HotizentalImageList>
        {images.map((p, i) => {
          return (
            <ImageCardContainer key={i}>
              <ImageCard
                onClick={(img) => {
                  currImageURL.current = img.src;
                  drawCanvas(img);
                }}
                src={p.imageURL}
                title={p.filename}
              />
            </ImageCardContainer>
          );
        })}
      </HotizentalImageList>
      <CanvasWrapper>
        <CanvasInnerWrapper>
          <Canvas ref={canvasRef} />
        </CanvasInnerWrapper>
      </CanvasWrapper>
      <PrimaryButton
        onClick={() => {
          api
            .infer({
              modelURL:
                'https://pub-524340b28b994541ba4d1f39e64d2b3d.r2.dev/ssd320.zip',
              imageURL: currImageURL.current,
              threshold: 0.5,
              width: 320,
              height: 320,
            })
            .then((data) => {
              drawBoundingBoxes(data);
            });
        }}
      >
        Detect
      </PrimaryButton>
    </>
  );
};

export default ModelPage;
