import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import {
  createContext,
  ReactNode,
  useContext,
  useReducer,
  useRef,
} from 'react';
import { InferResponse } from '../../types/api';
import annotationReducer, {
  addAnnotation,
  addBox,
  selectAnnotation,
} from './annotationReducer';

type State = {
  categoryList: string[];
  bboxes: InferResponse[];
  select: (url: string) => void;
  pushBbox: (bbox: InferResponse) => void;
};

const AnnotationContext = createContext<State>({
  categoryList: [],
  bboxes: [],
  select: () => void 0,
  pushBbox: () => void 0,
});

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
  const urlRef = useRef('');
  const [state, dispatch] = useReducer(annotationReducer, {
    bboxes: [],
    categoryList: [],
    annotationData: {},
    requestAnnotation: () => {
      queryClient.invalidateQueries(['annotation']);
    },
  });

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
        dispatch(addAnnotation({ url: urlRef.current, bboxes }));
      }
    },
  });

  const select = (url: string) => {
    urlRef.current = url;
    dispatch(selectAnnotation(url));
  };

  const pushBbox = (bbox: InferResponse) => {
    dispatch(addBox({ url: urlRef.current, bbox }));
  };

  return (
    <AnnotationContext.Provider
      value={{
        ...state,
        select,
        pushBbox,
      }}
    >
      {children}
    </AnnotationContext.Provider>
  );
};

const useAnnotation = (): State => {
  return useContext(AnnotationContext);
};

export { useAnnotation, AnnotationProvider };
