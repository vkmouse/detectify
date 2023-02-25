import { createContext, ReactNode, useContext, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { BatchUploadResponse } from '../types/api';
import api from '../api/api';

type State = {
  id: string;
  name: string | null;
  images: BatchUploadResponse[];
  irModel: string;
  isProjectImagesLoading: boolean;
  exportedModel: string;
  removeProjectImage: (imageId: string) => void;
};

const initialState: State = {
  id: '',
  name: null,
  images: [],
  irModel: '',
  isProjectImagesLoading: false,
  exportedModel: '',
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
  const [images, setImages] = useState<BatchUploadResponse[]>([]);

  useQuery({
    queryKey: ['projectInfo'],
    queryFn: () => {
      return api.getProject(id);
    },
    onSuccess: (data) => {
      setName(data.projectName);
      setIRModel(data.irModel);
      setExportedModel(data.exportedModel);
    },
  });

  const { isFetching } = useQuery({
    queryKey: ['projectImages'],
    queryFn: async () => {
      return await api.getProjectImages(id);
    },
    onSuccess: (data) => {
      setImages(data);
    },
  });

  const { isLoading, mutate } = useMutation<string, Error, string>({
    mutationFn: async (filename) => {
      await api.removeProjectImage(id, filename);
      return Promise.resolve(filename);
    },
    onSuccess: (filename) => {
      queryClient.invalidateQueries(['projectImages']);
      setImages((prev) => prev.filter((p) => p.filename !== filename));
    },
  });

  return (
    <ProjectInfoContext.Provider
      value={{
        id,
        name,
        images,
        irModel,
        isProjectImagesLoading: isFetching || isLoading,
        exportedModel,
        removeProjectImage: mutate,
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
