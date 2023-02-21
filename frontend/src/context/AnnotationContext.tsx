import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { createContext, ReactNode, useContext, useRef, useState } from 'react';
import { InferResponse } from '../types/api';

type AnnotationData = {
  url: string;
  bboxes: InferResponse[];
};

type State = {
  categoryList: string[];
  bboxes: InferResponse[];
  select: (url: string) => void;
  pushBbox: (bbox: InferResponse) => void;
};

const initialState: State = {
  categoryList: [],
  bboxes: [],
  select: () => void 0,
  pushBbox: () => void 0,
};

const AnnotationContext = createContext<State>(initialState);

const parseXml = (xml: any) => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xml, 'text/xml');

  const objects = xmlDoc.getElementsByTagName('object');
  const boundingBoxes = [];

  for (let i = 0; i < objects.length; i++) {
    const name = objects[i].getElementsByTagName('name')[0].textContent;
    const bndbox = objects[i].getElementsByTagName('bndbox')[0];
    const xmin = bndbox.getElementsByTagName('xmin')[0].textContent;
    const ymin = bndbox.getElementsByTagName('ymin')[0].textContent;
    const xmax = bndbox.getElementsByTagName('xmax')[0].textContent;
    const ymax = bndbox.getElementsByTagName('ymax')[0].textContent;
    if (xmin !== null && xmax !== null && ymin !== null && ymax !== null) {
      boundingBoxes.push({
        name: name === null ? '' : name,
        confidence: 1,
        height: parseInt(ymax) - parseInt(ymin),
        width: parseInt(xmax) - parseInt(xmin),
        x: parseInt(xmin),
        y: parseInt(ymin),
      });
    }
  }

  return boundingBoxes;
};

const AnnotationProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();
  const [bboxes, setBboxes] = useState<InferResponse[]>([]);
  const [categoryList, setCategoryList] = useState<string[]>([]);
  const annotationDataRef = useRef<AnnotationData[]>([]);
  const urlRef = useRef('');

  useQuery({
    queryKey: ['annotation'],
    queryFn: () => {
      if (urlRef.current !== '') {
        return axios.get(urlRef.current);
      }
      return Promise.resolve(null);
    },
    onSuccess: (body) => {
      if (body) {
        const { data: xml } = body;
        const bboxes = parseXml(xml);
        annotationDataRef.current.push({ url: urlRef.current, bboxes });
        setBboxes(bboxes);
        for (const bbox of bboxes) {
          if (!categoryList.includes(bbox.name)) {
            setCategoryList((prev) => [...prev, bbox.name]);
          }
        }
      }
    },
  });

  const select = (url: string) => {
    const arr = annotationDataRef.current.filter((p) => p.url === url);
    if (url && arr.length) {
      setBboxes(arr[0].bboxes);
    } else {
      urlRef.current = url;
      queryClient.invalidateQueries(['annotation']);
    }
  };

  const pushBbox = (bbox: InferResponse) => {
    for (const data of annotationDataRef.current) {
      if (data.url === urlRef.current) {
        data.bboxes.push(bbox);
        setBboxes((prev) => [...prev, bbox]);
        if (!categoryList.includes(bbox.name)) {
          setCategoryList((prev) => [...prev, bbox.name]);
        }
      }
    }
  };

  return (
    <AnnotationContext.Provider
      value={{ categoryList, bboxes, select, pushBbox }}
    >
      {children}
    </AnnotationContext.Provider>
  );
};

const useAnnotation = (): State => {
  return useContext(AnnotationContext);
};

export { useAnnotation, AnnotationProvider };
