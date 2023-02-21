import { Point, Rect } from '../types/types';

type State = {
  initialLocation: Point | null;
  labelingRoi: Rect | null;
};

enum Type {
  LABEL_START,
  LABEL_MOVE,
  LABEL_END,
}

type Action = { type: Type; payload: { location: Point } };

const labelStart = (location: Point): Action => {
  return { type: Type.LABEL_START, payload: { location } };
};

const labelMove = (location: Point): Action => {
  return { type: Type.LABEL_MOVE, payload: { location } };
};

const labelEnd = (): Action => {
  const location: Point = { x: 0, y: 0 };
  return { type: Type.LABEL_END, payload: { location } };
};

const annotationReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case Type.LABEL_START: {
      return { ...state, initialLocation: action.payload.location };
    }
    case Type.LABEL_MOVE: {
      if (state.initialLocation) {
        const { initialLocation } = state;
        return {
          ...state,
          labelingRoi: {
            x: Math.min(initialLocation.x, action.payload.location.x),
            y: Math.min(initialLocation.y, action.payload.location.y),
            width: Math.abs(initialLocation.x - action.payload.location.x) + 1,
            height: Math.abs(initialLocation.y - action.payload.location.y) + 1,
          },
        };
      }
      return state;
    }
    case Type.LABEL_END: {
      return {
        ...state,
        initialLocation: null,
        labelingRoi: null,
      };
    }
    default: {
      return state;
    }
  }
};

export default annotationReducer;
export { labelStart, labelMove, labelEnd };
