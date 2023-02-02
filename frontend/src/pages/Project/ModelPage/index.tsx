import { useEffect, useRef, useState } from 'react';
import ImageCard from '../../../components/ImageCard';
import { useProjectInfo } from '../../../context/ProjectInfoContext';
import {
  CanvasInnerWrapper,
  CanvasWrapper,
  HotizentalImageList,
  ImageCardContainer,
} from './styles';

const ModelPage = () => {
  const { images } = useProjectInfo();
  const divRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (divRef.current) {
      setCanvasSize({
        width: divRef.current?.clientWidth,
        height: divRef.current?.clientHeight,
      });
    }
  }, [divRef.current]);

  const drawCanvas = (image: HTMLImageElement) => {
    let imgWidth = image.naturalWidth;
    let imgHeight = image.naturalHeight;
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');

    if (canvas && context && imgWidth && imgHeight) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      if (canvas.width < imgWidth || canvas.height < imgHeight) {
        const ratio = Math.min(
          canvas.width / imgWidth,
          canvas.height / imgHeight
        );
        imgWidth = imgWidth * ratio;
        imgHeight = imgHeight * ratio;
      }
      const x = (canvas.width - imgWidth) / 2;
      const y = (canvas.height - imgHeight) / 2;
      context.drawImage(image, x, y, imgWidth, imgHeight);
    }
  };

  return (
    <>
      <HotizentalImageList>
        {images.map((p, i) => {
          return (
            <ImageCardContainer key={i}>
              <ImageCard
                onClick={drawCanvas}
                src={p.imageURL}
                title={p.filename}
              />
            </ImageCardContainer>
          );
        })}
      </HotizentalImageList>
      <CanvasWrapper>
        <CanvasInnerWrapper onResize={() => console.log('fsdf')} ref={divRef}>
          <canvas
            width={canvasSize.width}
            height={canvasSize.height}
            ref={canvasRef}
          />
        </CanvasInnerWrapper>
      </CanvasWrapper>
    </>
  );
};

export default ModelPage;
