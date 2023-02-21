import { useEffect, useRef } from 'react';
import { InferResponse } from '../types/api';
import { Rect } from '../types/types';
import { resizeCanvasAndCallCallback } from '../utils/canvasUtils';
import { ImageDrawer, ImageScaler } from '../utils/ImageDrawer';
import useWindowSize from './useWindowResize';

const useImageDrawer = (
  bboxes: InferResponse[],
  roi: Rect | null,
  image: HTMLImageElement | null,
  scaler: ImageScaler
) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawerRef = useRef<ImageDrawer | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx) {
      drawerRef.current = new ImageDrawer(ctx, scaler);
    }
  }, [canvasRef]);

  // repaint on image change
  useEffect(() => {
    if (image) {
      drawerRef.current?.setImage(image);
      scaler.setImageSize(image.naturalWidth, image.naturalHeight);
      scaler.autoScale(1);
    }
  }, [image]);

  // repaint on bboxes change
  useEffect(() => {
    drawerRef.current?.clearBboxes();
    for (const box of bboxes) {
      drawerRef.current?.pushBbox(box);
    }
    drawerRef.current?.draw();
  }, [bboxes]);

  // repaint on roi change
  useEffect(() => {
    if (roi) {
      const { x, y, width, height } = roi;
      drawerRef.current?.draw();
      drawerRef.current?.drawRect(x, y, width, height);
    }
  }, [roi]);

  // repaint on scaler change
  useWindowSize({
    onWindowResize: () =>
      resizeCanvasAndCallCallback(canvasRef?.current, (_, w, h) => {
        scaler.setPaintSize(w, h);
        scaler.autoScale(1);
        drawerRef.current?.draw();
      }),
  });

  return canvasRef;
};

export default useImageDrawer;
