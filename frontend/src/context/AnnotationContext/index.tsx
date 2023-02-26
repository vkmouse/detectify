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

type AnnotationInfo = {
  filename: string;
  url: string;
};

type State = {
  categoryList: string[];
  bboxes: InferResponse[];
  modifiedList: string[];
  select: (
    filename: string,
    url: string,
    width: number,
    height: number
  ) => void;
  pushBbox: (bbox: InferResponse) => void;
  generateAnnotation: () => { filename: string; xml: string }[];
};

const AnnotationContext = createContext<State>({
  categoryList: [],
  bboxes: [],
  modifiedList: [],
  select: () => void 0,
  pushBbox: () => void 0,
  generateAnnotation: () => {
    return [];
  },
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

const generateXml = (
  filename: string,
  width: number,
  height: number,
  bboxes: InferResponse[]
) => {
  let xmlContent =
    `<annotation verified="yes">\n` +
    `  <folder>Pictures</folder>\n` +
    `  <filename>${filename}</filename>\n` +
    `  <path>${filename}</path>\n` +
    `  <source>\n` +
    `    <database>Unknown</database>\n` +
    `  </source>\n` +
    `  <size>\n` +
    `    <width>${width}</width>\n` +
    `    <height>${height}</height>\n` +
    `    <depth>3</depth>\n` +
    `  </size>\n` +
    `  <segmented>0</segmented>\n`;

  for (const bbox of bboxes) {
    xmlContent +=
      `  <object>\n` +
      `    <name>${bbox.name}</name>\n` +
      `    <pose>Unspecified</pose>\n` +
      `    <truncated>0</truncated>\n` +
      `    <difficult>0</difficult>\n` +
      `    <bndbox>\n` +
      `      <xmin>${Math.floor(bbox.x)}</xmin>\n` +
      `      <ymin>${Math.floor(bbox.y)}</ymin>\n` +
      `      <xmax>${Math.floor(bbox.x + bbox.width)}</xmax>\n` +
      `      <ymax>${Math.floor(bbox.y + bbox.height)}</ymax>\n` +
      `    </bndbox>\n` +
      `  </object>\n`;
  }

  xmlContent += '</annotation>';

  return xmlContent;
};
const AnnotationProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();
  const urlRef = useRef<AnnotationInfo>({ filename: '', url: '' });
  const infoRef = useRef<Record<string, { width: number; height: number }>>({});
  const [state, dispatch] = useReducer(annotationReducer, {
    bboxes: [],
    categoryList: [],
    annotationData: {},
    modified: new Set<string>(),
    requestAnnotation: () => {
      queryClient.invalidateQueries(['annotation']);
    },
  });

  useQuery({
    queryKey: ['annotation'],
    queryFn: () => {
      if (urlRef.current.url.includes('.xml')) {
        return axios.get(urlRef.current.url);
      }
      dispatch(addAnnotation({ url: urlRef.current.filename, bboxes: [] }));
      return Promise.resolve(null);
    },
    onSuccess: (body) => {
      if (body) {
        const { data: xml } = body;
        const bboxes = parseXml(xml);
        dispatch(addAnnotation({ url: urlRef.current.filename, bboxes }));
      }
    },
  });

  const select = (
    filename: string,
    url: string,
    width: number,
    height: number
  ) => {
    urlRef.current = { filename, url };
    infoRef.current[filename] = { width, height };
    dispatch(selectAnnotation(filename));
  };

  const pushBbox = (bbox: InferResponse) => {
    dispatch(addBox({ url: urlRef.current.filename, bbox }));
  };
  const generateAnnotation = () => {
    const generatedData: { filename: string; xml: string }[] = [];

    for (const filename of Array.from(state.modified)) {
      const bboxes = state.annotationData[filename];
      const xmlContent = generateXml(
        filename,
        infoRef.current[filename].width,
        infoRef.current[filename].height,
        bboxes
      );
      generatedData.push({ filename, xml: xmlContent });
    }

    return generatedData;
  };

  return (
    <AnnotationContext.Provider
      value={{
        ...state,
        modifiedList: Array.from(state.modified),
        select,
        pushBbox,
        generateAnnotation,
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
