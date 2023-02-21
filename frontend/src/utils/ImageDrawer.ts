import { InferResponse } from '../types/api';

interface TransformValues {
  offsetX: number;
  offsetY: number;
  scale: number;
}

class ImageScaler {
  private paintWidth: number;
  private paintHeight: number;
  private imageWidth: number;
  private imageHeight: number;
  private offsetX: number;
  private offsetY: number;
  private scale: number;

  constructor() {
    this.paintWidth = 0;
    this.paintHeight = 0;
    this.imageWidth = 0;
    this.imageHeight = 0;
    this.scale = 1;
    this.offsetX = 0;
    this.offsetY = 0;
  }

  setPaintSize(paintWidth: number, paintHeight: number) {
    this.paintWidth = paintWidth;
    this.paintHeight = paintHeight;

    const transform = this.transformCoordinateSystem(
      this.imageWidth,
      this.imageHeight,
      this.paintWidth,
      this.paintHeight,
      this.scale
    );
    this.scale = transform.scale;
    this.offsetX = transform.offsetX;
    this.offsetY = transform.offsetY;
  }

  setImageSize(imageWidth: number, imageHeight: number) {
    this.imageWidth = imageWidth;
    this.imageHeight = imageHeight;

    const transform = this.transformCoordinateSystem(
      this.imageWidth,
      this.imageHeight,
      this.paintWidth,
      this.paintHeight,
      this.scale
    );
    this.scale = transform.scale;
    this.offsetX = transform.offsetX;
    this.offsetY = transform.offsetY;
  }

  setPaintAndImageSizes(
    paintWidth: number,
    paintHeight: number,
    imageWidth: number,
    imageHeight: number
  ) {
    this.paintWidth = paintWidth;
    this.paintHeight = paintHeight;
    this.imageWidth = imageWidth;
    this.imageHeight = imageHeight;

    const transform = this.transformCoordinateSystem(
      this.imageWidth,
      this.imageHeight,
      this.paintWidth,
      this.paintHeight,
      this.scale
    );
    this.scale = transform.scale;
    this.offsetX = transform.offsetX;
    this.offsetY = transform.offsetY;
  }

  transformCoordinateSystem(
    fromWidth: number,
    fromHeight: number,
    toWidth: number,
    toHeight: number,
    scale: number
  ): TransformValues {
    const newWidth = fromWidth * scale;
    const newHeight = fromHeight * scale;
    const offsetX = (toWidth - newWidth) / 2;
    const offsetY = (toHeight - newHeight) / 2;
    return { offsetX, offsetY, scale };
  }

  paintToImage(x: number, y: number): [number, number] {
    // Convert a point from paint coordinates to image coordinates
    const imageX = (x - this.offsetX) / this.scale;
    const imageY = (y - this.offsetY) / this.scale;
    return [imageX, imageY];
  }

  imageToPaint(x: number, y: number): [number, number] {
    // Convert a point from image coordinates to paint coordinates
    const paintX = x * this.scale + this.offsetX;
    const paintY = y * this.scale + this.offsetY;
    return [paintX, paintY];
  }

  paintToImageLength(length: number): number {
    // Convert a length from paint coordinates to image coordinates
    return length / this.scale;
  }

  imageToPaintLength(length: number): number {
    // Convert a length from image coordinates to paint coordinates
    return length * this.scale;
  }

  imageToPaintRect(x: number, y: number, width: number, height: number) {
    const [newX, newY] = this.imageToPaint(x, y);
    const newWidth = this.imageToPaintLength(width);
    const newHeight = this.imageToPaintLength(height);
    return [newX, newY, newWidth, newHeight];
  }

  autoScale(min?: number) {
    const scaleX = this.paintWidth / this.imageWidth;
    const scaleY = this.paintHeight / this.imageHeight;
    let scale = Math.min(scaleX, scaleY);
    if (min) {
      scale = Math.min(scale, min);
    }
    const transform = this.transformCoordinateSystem(
      this.imageWidth,
      this.imageHeight,
      this.paintWidth,
      this.paintHeight,
      scale
    );

    this.scale = transform.scale;
    this.offsetX = transform.offsetX;
    this.offsetY = transform.offsetY;
  }
}

class ImageDrawer {
  private ctx: CanvasRenderingContext2D;
  private scaler: ImageScaler;
  private image: HTMLImageElement | null;
  private bboxes: InferResponse[];

  constructor(ctx: CanvasRenderingContext2D, scaler: ImageScaler) {
    this.ctx = ctx;
    this.scaler = scaler;
    this.image = null;
    this.bboxes = [];
  }

  draw() {
    if (this.image) {
      this.drawImage(this.image);
      for (const box of this.bboxes) {
        this.drawRect(box.name, box.x, box.y, box.width, box.height);
      }
    }
  }

  drawImage(image: HTMLImageElement) {
    const [x, y, width, height] = this.scaler.imageToPaintRect(
      0,
      0,
      image.naturalWidth,
      image.naturalHeight
    );
    this.ctx.drawImage(image, x, y, width, height);
  }

  drawRect(name: string, x: number, y: number, width: number, height: number) {
    const [paintX, paintY, paintWidth, paintHeight] =
      this.scaler.imageToPaintRect(x, y, width, height);
    const fontSize = 18;
    const color = '#FF0000';
    this.ctx.font = `${fontSize}px Microsoft YaHei`;
    this.ctx.strokeStyle = color;
    this.ctx.fillStyle = color;
    this.ctx.lineWidth = 3;

    this.ctx.beginPath();
    this.ctx.rect(paintX, paintY, paintWidth, paintHeight);
    this.ctx.stroke();

    const labelName = name;
    const { width: textWidth } = this.ctx.measureText(labelName);
    this.ctx.fillStyle = color;
    this.ctx.fillRect(
      paintX - this.ctx.lineWidth / 2,
      paintY - fontSize - this.ctx.lineWidth / 2,
      textWidth + this.ctx.lineWidth,
      fontSize + this.ctx.lineWidth
    );
    this.ctx.fillStyle = '#fff';
    this.ctx.fillText(labelName, paintX, paintY - this.ctx.lineWidth / 2);
  }

  setImage(image: HTMLImageElement) {
    this.image = image;
  }

  pushBbox(bbox: InferResponse) {
    this.bboxes.push(bbox);
  }

  clearBboxes() {
    this.bboxes = [];
  }
}

export { ImageScaler, ImageDrawer };
