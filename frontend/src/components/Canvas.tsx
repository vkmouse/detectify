import React, { CanvasHTMLAttributes, DetailedHTMLProps } from 'react';
import styled from 'styled-components';
import useWindowSize from '../hooks/useWindowResize';
import { resizeCanvasAndCallCallback } from '../utils/canvasUtils';

interface Props
  extends DetailedHTMLProps<
    CanvasHTMLAttributes<HTMLCanvasElement>,
    HTMLCanvasElement
  > {
  onPaint?: (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ) => void;
}

const Container = styled.div`
  position: relative;
`;

const CanvasElement = styled.canvas`
  position: absolute;
`;

const Canvas = React.forwardRef<HTMLCanvasElement, Props>(
  ({ className, onPaint, ...rest }, ref) => {
    const canvasRef = ref as React.MutableRefObject<HTMLCanvasElement | null>;

    useWindowSize({
      onWindowResize: () =>
        resizeCanvasAndCallCallback(canvasRef?.current, onPaint),
    });

    return (
      <Container className={className}>
        <CanvasElement {...rest} ref={ref} />
      </Container>
    );
  }
);

Canvas.displayName = 'Canvas';

export default Canvas;
