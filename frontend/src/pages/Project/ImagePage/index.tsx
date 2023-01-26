import { UploadContainer, UploadLayout } from './styles';
import { useReducer } from 'react';
import api from '../../../api/api';
import { useQuery } from '@tanstack/react-query';
import useFileUpload from '../../../hooks/useFileUpload';
import UploadCard from './UploadCard';
import ProgressCard from './ProgressCard';

type State = {
  uploadQueue: {
    file: File;
    progress: number;
  }[];
};

enum Type {
  ADD_TO_QUEUE,
  UPDATE_PROGRESS,
  DELETE_FROM_QUEUE,
  CLEAR_QUEUE,
}

type Action = { type: Type; payload?: any };
const addToQueue = (files: File[]): Action => {
  return { type: Type.ADD_TO_QUEUE, payload: { files } };
};
const updateProgress = (filename: string, progress: number): Action => {
  return { type: Type.UPDATE_PROGRESS, payload: { filename, progress } };
};
const deleteFromQueue = (filename: string): Action => {
  return { type: Type.DELETE_FROM_QUEUE, payload: { filename } };
};
const clearQueue = (): Action => {
  return { type: Type.CLEAR_QUEUE };
};

const initialState: State = {
  uploadQueue: [],
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case Type.ADD_TO_QUEUE: {
      const { files }: { files: File[] } = action.payload;
      const newUploadQueue = files.map((file) => {
        return { file, progress: 0 };
      });
      return {
        uploadQueue: [...state.uploadQueue, ...newUploadQueue],
      };
    }

    case Type.UPDATE_PROGRESS: {
      const { filename, progress } = action.payload;
      const uploadQueue = [...state.uploadQueue];
      for (const item of uploadQueue) {
        if (item.file.name === filename) {
          item.progress = progress;
        }
      }
      return { uploadQueue };
    }

    case Type.DELETE_FROM_QUEUE: {
      const { filename } = action.payload;
      return {
        uploadQueue: state.uploadQueue.filter((p) => p.file.name !== filename),
      };
    }

    case Type.CLEAR_QUEUE: {
      return { uploadQueue: [] };
    }

    default: {
      return state;
    }
  }
};

const ProjectImagePage = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { mutate: uploadFile } = useFileUpload();
  const { refetch: uploadFiles, isFetching: uploadFilesIsFetching } = useQuery({
    queryKey: ['uploadFiles'],
    queryFn: async () => {
      if (state.uploadQueue) {
        for (const status of state.uploadQueue) {
          const file = status.file;
          const response = await api.createUpload();
          uploadFile({
            presignedURL: response.presignedURL,
            file,
            updateProgress: (progress: number) =>
              dispatch(updateProgress(file.name, progress)),
          });
        }
      }
      return true;
    },
    enabled: false,
  });

  const handleSelectFiles = (files: File[]) => {
    dispatch(clearQueue());
    dispatch(addToQueue(files));
  };

  const selectionButtonDisabled = uploadFilesIsFetching;
  const uploadButtonDisabled =
    state.uploadQueue.length === 0 ||
    state.uploadQueue.filter((p) => p.progress !== 100).length === 0 || // all is uploaded
    uploadFilesIsFetching;

  return (
    <UploadContainer>
      <UploadLayout>
        <UploadCard
          disabled={selectionButtonDisabled}
          onChange={handleSelectFiles}
        />
        <ProgressCard
          queue={state.uploadQueue}
          disabled={uploadButtonDisabled}
          onUpload={uploadFiles}
          onDelete={(filename) => dispatch(deleteFromQueue(filename))}
        />
      </UploadLayout>
    </UploadContainer>
  );
};

export default ProjectImagePage;
