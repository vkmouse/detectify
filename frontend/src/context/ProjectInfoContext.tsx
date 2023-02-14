import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useQuery } from '@tanstack/react-query';
import { BatchUploadResponse } from '../types/api';
import api from '../api/api';

type State = {
  id: string;
  name: string | null;
  images: BatchUploadResponse[];
  irModel: string;
  exportedModel: string;
};

const initialState: State = {
  id: '',
  name: null,
  images: [],
  irModel: '',
  exportedModel: '',
};

const ProjectInfoContext = createContext<State>(initialState);

const useProjectImages = (projectId: string) => {
  const [images, setImages] = useState<BatchUploadResponse[]>([]);

  useQuery({
    queryKey: ['projectImages'],
    queryFn: async () => {
      return await api.getProjectImages(projectId);
    },
    onSuccess: (data) => {
      setImages(data);
    },
  });

  return { images };
};

const useProjectName = (projectId: string) => {
  const [name, setName] = useState('');
  const [irModel, setIRModel] = useState('');
  const [exportedModel, setExportedModel] = useState('');

  useEffect(() => {
    api.getProject(projectId).then((data) => {
      setName(data.projectName);
      setIRModel(data.irModel);
      setExportedModel(data.exportedModel);
    });
  }, []);

  return { irModel, exportedModel, name };
};

const ProjectInfoProvider = ({ children }: { children: ReactNode }) => {
  const { pathname } = window.location;
  const subs = pathname.split('/');
  const id = subs[subs.findIndex((p) => p === 'project') + 1];
  const { name, irModel, exportedModel } = useProjectName(id);
  const { images } = useProjectImages(id);

  return (
    <ProjectInfoContext.Provider
      value={{ id, name, images, irModel, exportedModel }}
    >
      {children}
    </ProjectInfoContext.Provider>
  );
};

const useProjectInfo = (): State => {
  return useContext(ProjectInfoContext);
};

export { useProjectInfo, ProjectInfoProvider };
