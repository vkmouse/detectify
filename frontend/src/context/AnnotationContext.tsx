import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { createContext, ReactNode, useContext, useRef, useState } from 'react';
import { InferResponse } from '../types/api';

type AnnotationData = {
  url: string;
  bboxes: InferResponse[];
};

type State = {
  isFetching: boolean;
  selected: InferResponse[];
  select: (url: string) => void;
};

const initialState: State = {
  isFetching: true,
  selected: [],
  select: () => void 0,
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
  const [selected, setSelected] = useState<InferResponse[]>([]);
  const annotationDataRef = useRef<AnnotationData[]>([]);
  const urlRef = useRef('');

  const { isFetching } = useQuery({
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
        setSelected(bboxes);
      }
    },
  });

  const select = (url: string) => {
    const arr = annotationDataRef.current.filter((p) => p.url === url);
    if (url && arr.length) {
      setSelected(arr[0].bboxes);
    } else {
      urlRef.current = url;
      queryClient.invalidateQueries(['annotation']);
    }
  };

  return (
    <AnnotationContext.Provider value={{ isFetching, selected, select }}>
      {children}
    </AnnotationContext.Provider>
  );
};

const useAnnotation = (): State => {
  return useContext(AnnotationContext);
};

export { useAnnotation, AnnotationProvider };
