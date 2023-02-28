import { useEffect, useRef, useState } from 'react';
import { InferResponse } from '../types/api';
import axios from 'axios';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';

const useWebModel = (webModelURL: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const modelRef = useRef<tf.GraphModel<string | tf.io.IOHandler> | null>(null);
  const modelSizeRef = useRef<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });
  const labelsRef = useRef<string[]>([]);

  const loadModel = async () => {
    const modelURL = webModelURL + '/model.json';
    const metaDataURL = webModelURL + '/data.meta';

    const model = await tf.loadGraphModel(modelURL);
    const { data } = await axios.get(metaDataURL);

    const zeroTensor = tf.zeros([1, 320, 320, 3], 'int32');
    await model.executeAsync(zeroTensor);

    modelRef.current = model;
    modelSizeRef.current = data.model;
    labelsRef.current = data.labels;
    setIsLoading(false);
  };

  const loadImage = (url: string) =>
    new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image(
        modelSizeRef.current.width,
        modelSizeRef.current.height
      );
      img.addEventListener('load', () => resolve(img));
      img.addEventListener('error', (err) => reject(err));
      if (url.includes('blob')) {
        img.src = url;
      } else {
        img.src = url + '?' + new Date().getTime();
      }
      img.setAttribute('crossOrigin', '');
    });

  const detect = async (url: string, threshold: number) => {
    if (modelRef.current === null) {
      return [];
    }

    const image = await loadImage(url);
    const tensor = tf.browser.fromPixels(image).expandDims(0);
    const result = (await modelRef.current.executeAsync(tensor, [
      'num_detections',
      'detection_boxes',
      'Identity_2:0',
      'Identity_4:0',
    ])) as tf.Tensor[];

    const numDetections = (result[0].arraySync() as number[])[0];
    const detectionBoxes = (result[1].arraySync() as number[][][])[0];
    const detectionClasses = (result[2].arraySync() as number[][])[0];
    const detectionScores = (result[3].arraySync() as number[][])[0];

    const bboxes: InferResponse[] = [];
    for (let i = 0; i < numDetections; i++) {
      const box = detectionBoxes[i];
      const name = labelsRef.current[detectionClasses[i]];
      if (detectionScores[i] > threshold) {
        bboxes.push({
          name: name,
          confidence: detectionScores[i],
          x: box[1] * image.naturalWidth,
          y: box[0] * image.naturalHeight,
          width: (box[3] - box[1]) * image.naturalWidth,
          height: (box[2] - box[0]) * image.naturalHeight,
        });
      }
    }

    return bboxes;
  };

  useEffect(() => {
    if (webModelURL) {
      setIsLoading(true);
      loadModel();
    }
  }, [webModelURL]);

  return { isLoading, detect };
};

export default useWebModel;
