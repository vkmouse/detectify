import { InferResponse } from '../types/api';

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

const drawBoundingBoxes = (
  canvas: HTMLCanvasElement,
  displayRegion: { x: number; y: number; width: number; height: number },
  displayRadio: number,
  boundingBoxes: InferResponse[]
) => {
  const context = canvas.getContext('2d');
  if (context) {
    for (const box of boundingBoxes) {
      const x = displayRegion.x + box.x * displayRadio;
      const y = displayRegion.y + box.y * displayRadio;
      const width = box.width * displayRadio;
      const height = box.height * displayRadio;
      const name = box.name;
      drawRect(context, name, x, y, width, height);
    }
  }
};

const resizeCanvasAndCallCallback = (
  canvas: HTMLCanvasElement | null,
  callback?: (
    ctx: CanvasRenderingContext2D,
    canvasWidth: number,
    canvasHeight: number
  ) => void
) => {
  const ctx = canvas?.getContext('2d');
  if (
    canvas &&
    canvas?.width &&
    canvas?.height &&
    canvas?.parentElement?.clientWidth &&
    canvas?.parentElement?.clientHeight &&
    ctx
  ) {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
    const { width, height } = canvas;
    callback?.(ctx, width, height);
  }
};

export { drawRect, drawBoundingBoxes, resizeCanvasAndCallCallback };
