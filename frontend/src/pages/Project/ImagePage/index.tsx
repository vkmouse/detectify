import { UploadContainer, UploadLayout } from './styles';
import { useReducer } from 'react';
import api from '../../../api/api';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import useProjectInfo from '../../../hooks/useProjectInfo';
import {
  checkAnnotationExtenstion,
  checkImageExtenstion,
  convertFilenames,
  getFilenameExtension,
  getFilenameWithoutExtension,
} from '../../../utils/file';
import useBatchUpload from './hooks/useBatchUpload';
import { UploadProperty } from '../../../types/api';
import ImageList from './components/ImageList';
import ProgressCard from './components/ProgressCard';
import UploadCard from './components/UploadCard';

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

// TODO: Refactor component
const ProjectImagePage = () => {
  const { projectId } = useProjectInfo();
  const [state, dispatch] = useReducer(reducer, initialState);
  const { isUploading, uploadFiles } = useBatchUpload();
  const queryClient = useQueryClient();
  const { refetch: createBatchUpload, isFetching: uploadFilesIsFetching } =
    useQuery({
      queryKey: ['uploadFiles'],
      queryFn: async () => {
        if (state.uploadQueue) {
          const filenames = state.uploadQueue.map((p) => p.file.name);
          const data: UploadProperty[] = [];
          const resp = await api.createBatchUpload({
            projectId,
            uploadedFiles: convertFilenames(filenames),
          });
          for (const { file } of state.uploadQueue) {
            let presignedURL = '';
            const filenameOnly = getFilenameWithoutExtension(file.name);
            const extension = getFilenameExtension(file.name);
            const item = resp.get(filenameOnly);
            if (checkImageExtenstion(extension) && item) {
              presignedURL = item.imageURL;
            } else if (checkAnnotationExtenstion(extension) && item) {
              presignedURL = item.annotationURL;
            }
            data.push({
              presignedURL,
              file,
              updateProgress: (progress: number) =>
                dispatch(updateProgress(file.name, progress)),
            });
          }
          return data;
        }
        return [];
      },
      onSuccess: (data) => {
        uploadFiles({
          data,
          onSuccess: () => {
            api
              .publishBatchUpload({
                projectId,
                publishFiles: convertFilenames(
                  data.map((p) => p.file.name)
                ).map((p) => p.filename),
              })
              .then(() => {
                queryClient.invalidateQueries(['projectImages']);
              });
          },
        });
      },
      enabled: false,
    });

  const handleSelectFiles = (files: File[]) => {
    dispatch(clearQueue());
    dispatch(addToQueue(files));
  };

  const selectionButtonDisabled = uploadFilesIsFetching || isUploading;
  const uploadButtonDisabled =
    uploadFilesIsFetching ||
    isUploading ||
    state.uploadQueue.length === 0 ||
    state.uploadQueue.filter((p) => p.progress !== 100).length === 0; // all is uploaded

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
          onUpload={createBatchUpload}
          onDelete={(filename) => dispatch(deleteFromQueue(filename))}
        />
      </UploadLayout>
      <ImageList projectId={projectId} />
    </UploadContainer>
  );
};

export default ProjectImagePage;
