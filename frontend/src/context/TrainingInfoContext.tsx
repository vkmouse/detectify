import { useQuery, useQueryClient } from '@tanstack/react-query';
import { createContext, ReactNode, useContext, useState } from 'react';
import api from '../api/api';
import { TrainingStatusResponse } from '../types/api';

type State = {
  progress: number | null;
  status: string | null;
  duration: string | null;
  isTraining: boolean;
  reloadServerInfo: () => void;
};

const initialState: State = {
  progress: null,
  status: null,
  duration: null,
  isTraining: false,
  reloadServerInfo: () => void 0,
};

const TrainingInfoContext = createContext<State>(initialState);

const TrainingInfoProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();
  const [isTraining, setIsTraining] = useState(false);
  const [trainingInfo, setTrainingInfo] = useState<TrainingStatusResponse>({
    ...initialState,
  });

  const reloadServerInfo = () => {
    queryClient.invalidateQueries(['trainingInfo']);
  };

  useQuery({
    queryKey: ['trainingInfo'],
    queryFn: () => {
      return api.getTrainingStatus();
    },
    onSuccess: (data) => {
      const isTraining = data.progress !== null;
      setTrainingInfo(data);
      setIsTraining(isTraining);
      if (isTraining) {
        setTimeout(() => reloadServerInfo(), 5000);
      }
    },
  });

  return (
    <TrainingInfoContext.Provider
      value={{
        ...trainingInfo,
        isTraining,
        reloadServerInfo,
      }}
    >
      {children}
    </TrainingInfoContext.Provider>
  );
};

const useTrainingInfo = (): State => {
  return useContext(TrainingInfoContext);
};

export { useTrainingInfo, TrainingInfoProvider };
