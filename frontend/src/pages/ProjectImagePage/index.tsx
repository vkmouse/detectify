import UploadButton from './UploadButton';
import ProgressRow from './ProgressRow';
import {
  Button,
  ButtonGroup,
  FilePicker,
  ProgressContainer,
  ProgressWrapper,
  UploadColumn,
  UploadContainer,
  UploadLayout,
} from './styles';
import { useReducer } from 'react';
import api from '../../api/api';
import { useQuery } from '@tanstack/react-query';
import useFileUpload from '../../hooks/useFileUpload';

type State = {
  uploadQueue: {
    file: File;
    progress: number;
  }[];
};

enum Type {
  ADD_TO_QUEUE,
  UPDATE_PROGRESS,
  CLEAR_QUEUE,
}

type Action = { type: Type; payload?: any };
const addToQueue = (files: File[]): Action => {
  return { type: Type.ADD_TO_QUEUE, payload: { files } };
};
const updateProgress = (filename: string, progress: number): Action => {
  return { type: Type.UPDATE_PROGRESS, payload: { filename, progress } };
};
const clearQueue = (): Action => {
  return { type: Type.CLEAR_QUEUE };
};

const initialState: State = {
  uploadQueue: [],
};

const reducer = (state: State, action: Action): State => {
  const filterOutSameFile = (filename: string) =>
    state.uploadQueue.filter((p) => p.file.name !== filename);
  const filterSameFile = (filename: string) =>
    state.uploadQueue.filter((p) => p.file.name === filename);

  switch (action.type) {
    case Type.ADD_TO_QUEUE: {
      const { files }: { files: File[] } = action.payload;
      const newUploadQueue = files.map((file) => {
        return { file, progress: 0 };
      });
      return {
        ...state,
        uploadQueue: [...state.uploadQueue, ...newUploadQueue],
      };
    }

    case Type.UPDATE_PROGRESS: {
      const { filename, progress } = action.payload;
      const uploadQueue = filterOutSameFile(filename);
      const current = filterSameFile(filename)[0];
      uploadQueue.push({ file: current.file, progress });
      return { ...state, uploadQueue: uploadQueue };
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
    <>
      <span>Image</span>
      <hr />
      <UploadContainer>
        <UploadLayout>
          <UploadColumn>
            <FilePicker />
            <ButtonGroup>
              <UploadButton
                multiple
                accept=".jpg,.jpeg,.png,.xml"
                disabled={selectionButtonDisabled}
                onChange={handleSelectFiles}
              >
                Select File
              </UploadButton>
              <UploadButton
                directory
                accept=".jpg,.jpeg,.png,.xml"
                disabled={selectionButtonDisabled}
                onChange={handleSelectFiles}
              >
                Select Folder
              </UploadButton>
            </ButtonGroup>
          </UploadColumn>
          <ProgressContainer>
            <ProgressWrapper>
              {state.uploadQueue.map((status, i) => {
                return (
                  <ProgressRow
                    key={i}
                    filename={status.file.name}
                    percentage={status.progress}
                  />
                );
              })}
            </ProgressWrapper>
            <ButtonGroup>
              <Button
                disabled={uploadButtonDisabled}
                onClick={() => uploadFiles()}
              >
                Upload
              </Button>
            </ButtonGroup>
          </ProgressContainer>
        </UploadLayout>
      </UploadContainer>
    </>
  );
};

export default ProjectImagePage;
