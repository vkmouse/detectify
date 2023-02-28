import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { BatchUploadResponse, InferResponse } from '../types/api';
import api from '../api/api';
import { useTrainingInfo } from './TrainingInfoContext';
import useWebModel from '../hooks/useWebModel';

type State = {
  id: string;
  name: string | null;
  images: BatchUploadResponse[];
  irModel: string;
  isLoading: boolean;
  exportedModel: string;
  webModel: {
    isLoading: boolean;
    detect: (url: string, threshold: number) => Promise<InferResponse[]>;
  };
  removeProjectImage: (imageId: string) => void;
};

const initialState: State = {
  id: '',
  name: null,
  images: [],
  irModel: '',
  isLoading: false,
  exportedModel: '',
  webModel: {
    isLoading: false,
    detect: async () => [],
  },
  removeProjectImage: () => void 0,
};

const ProjectInfoContext = createContext<State>(initialState);

const ProjectInfoProvider = ({ children }: { children: ReactNode }) => {
  const { pathname } = window.location;
  const subs = pathname.split('/');
  const id = subs[subs.findIndex((p) => p === 'project') + 1];
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [irModel, setIRModel] = useState('');
  const [exportedModel, setExportedModel] = useState('');
  const [webModelURL, setWebModelURL] = useState('');
  const [images, setImages] = useState<BatchUploadResponse[]>([]);
  const { status: trainingStatus } = useTrainingInfo();
  const webModel = useWebModel(webModelURL);

  const { isFetching: isInfoFetching } = useQuery({
    queryKey: ['projectInfo'],
    queryFn: () => {
      return api.getProject(id);
    },
    onSuccess: (data) => {
      setName(data.projectName);
      setIRModel(data.irModel);
      setExportedModel(data.exportedModel);
      setWebModelURL(data.webModel);
    },
  });

  const { isFetching: isImageFetching } = useQuery({
    queryKey: ['projectImages'],
    queryFn: async () => {
      return await api.getProjectImages(id);
    },
    onSuccess: (data) => {
      setImages(data);
    },
  });

  const { isLoading: isRemovingImage, mutate } = useMutation<
    string,
    Error,
    string
  >({
    mutationFn: async (filename) => {
      await api.removeProjectImage(id, filename);
      return Promise.resolve(filename);
    },
    onSuccess: (filename) => {
      queryClient.invalidateQueries(['projectImages']);
      setImages((prev) => prev.filter((p) => p.filename !== filename));
    },
  });

  useEffect(() => {
    if (trainingStatus === 'Completed') {
      queryClient.invalidateQueries(['projectInfo']);
    }
  }, [trainingStatus]);

  return (
    <ProjectInfoContext.Provider
      value={{
        id,
        name,
        images,
        irModel,
        isLoading:
          isImageFetching ||
          isRemovingImage ||
          webModel.isLoading ||
          isInfoFetching,
        exportedModel,
        removeProjectImage: mutate,
        webModel,
      }}
    >
      {children}
    </ProjectInfoContext.Provider>
  );
};

const useProjectInfo = (): State => {
  return useContext(ProjectInfoContext);
};

export { useProjectInfo, ProjectInfoProvider };
