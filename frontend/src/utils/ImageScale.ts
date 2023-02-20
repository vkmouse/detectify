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

  autoScale() {
    const scaleX = this.paintWidth / this.imageWidth;
    const scaleY = this.paintHeight / this.imageHeight;

    const transform = this.transformCoordinateSystem(
      this.imageWidth,
      this.imageHeight,
      this.paintWidth,
      this.paintHeight,
      Math.min(scaleX, scaleY)
    );

    this.scale = transform.scale;
    this.offsetX = transform.offsetX;
    this.offsetY = transform.offsetY;
  }

  getScale() {
    return this.scale;
  }

  setScale(scale: number) {
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

export default ImageScaler;
