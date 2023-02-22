import { InferResponse } from '../../types/api';

type AnnotationData = {
  url: string;
  bboxes: InferResponse[];
};

type AnnotationState = {
  bboxes: InferResponse[];
  categoryList: string[];
  annotationData: Record<string, InferResponse[]>;
  requestAnnotation: () => void;
};

type AnnotationAction =
  | { type: 'ADD_BBOX'; payload: { url: string; bbox: InferResponse } }
  | { type: 'ADD_ANNOTATION'; payload: AnnotationData }
  | { type: 'SET_BBOXES'; payload: InferResponse[] }
  | { type: 'SELECT_ANNOTATION'; payload: string };

const addBox = (payload: {
  url: string;
  bbox: InferResponse;
}): AnnotationAction => {
  return { type: 'ADD_BBOX', payload };
};

const addAnnotation = (payload: AnnotationData): AnnotationAction => {
  return { type: 'ADD_ANNOTATION', payload };
};

const setBboxes = (payload: InferResponse[]): AnnotationAction => {
  return { type: 'SET_BBOXES', payload };
};

const selectAnnotation = (payload: string): AnnotationAction => {
  return { type: 'SELECT_ANNOTATION', payload };
};

const annotationReducer = (
  state: AnnotationState,
  action: AnnotationAction
): AnnotationState => {
  switch (action.type) {
    case 'ADD_BBOX': {
      const bboxes = [...state.bboxes, action.payload.bbox];
      const annotationData = {
        ...state.annotationData,
        [action.payload.url]: bboxes,
      };
      return {
        ...state,
        annotationData,
        bboxes,
        categoryList: state.categoryList.includes(action.payload.bbox.name)
          ? state.categoryList
          : [...state.categoryList, action.payload.bbox.name],
      };
    }
    case 'ADD_ANNOTATION': {
      const { url, bboxes } = action.payload;
      const annotationData = { ...state.annotationData, [url]: bboxes };
      const categoryList = [...state.categoryList];
      for (const bbox of bboxes) {
        if (!categoryList.includes(bbox.name)) {
          categoryList.push(bbox.name);
        }
      }
      return {
        ...state,
        annotationData,
        bboxes,
        categoryList,
      };
    }
    case 'SET_BBOXES':
      return { ...state, bboxes: action.payload };
    case 'SELECT_ANNOTATION': {
      const url = action.payload;
      if (!url) {
        state.requestAnnotation();
        return state;
      }
      const bboxes = state.annotationData[url];
      if (!bboxes) {
        state.requestAnnotation();
        return state;
      }
      return { ...state, bboxes };
    }
    default:
      return state;
  }
};

export default annotationReducer;
export { addBox, addAnnotation, setBboxes, selectAnnotation };
