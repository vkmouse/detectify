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
};

const initialState: State = {
  id: '',
  name: null,
  images: [],
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

  useEffect(() => {
    // TODO: new project info api to get name
    api.getProjects().then((data) => {
      const detail = data.filter((p) => p.id === projectId).at(0);
      if (detail) {
        setName(detail.name);
      }
    });
  }, []);

  return { name };
};

const ProjectInfoProvider = ({ children }: { children: ReactNode }) => {
  const { pathname } = window.location;
  const subs = pathname.split('/');
  const id = subs[subs.findIndex((p) => p === 'project') + 1];
  const { name } = useProjectName(id);
  const { images } = useProjectImages(id);

  return (
    <ProjectInfoContext.Provider value={{ id, name, images }}>
      {children}
    </ProjectInfoContext.Provider>
  );
};

const useProjectInfo = (): State => {
  return useContext(ProjectInfoContext);
};

export { useProjectInfo, ProjectInfoProvider };
