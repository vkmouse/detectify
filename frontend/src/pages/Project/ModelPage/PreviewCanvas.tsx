import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Card } from '../../../components/Card';
import { Loading } from '../../../components/Loading';

const CanvasWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 0;
  padding-top: 75%;
`;

const CanvasOverlay = styled(Card)`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
`;

const Canvas = React.forwardRef<HTMLCanvasElement>(({}, ref) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

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

const PreviewCanvas = React.forwardRef<
  HTMLCanvasElement,
  { isLoading: boolean }
>(({ isLoading }, ref) => {
  return (
    <CanvasWrapper>
      <CanvasOverlay>
        <Canvas ref={ref} />
      </CanvasOverlay>
      {isLoading && <Loading />}
    </CanvasWrapper>
  );
});

PreviewCanvas.displayName = 'PreviewCanvas';

export default PreviewCanvas;
