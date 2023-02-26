import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
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
  const [isTraining, setIsTraining] = useState(true);
  const [trainingInfo, setTrainingInfo] = useState<TrainingStatusResponse>({
    ...initialState,
  });

  const reloadServerInfo = () => {
    queryClient.invalidateQueries(['trainingInfo']);
    setIsTraining(true);
  };

  useQuery({
    queryKey: ['trainingInfo'],
    queryFn: () => {
      return api.getTrainingStatus();
    },
    onSuccess: (data) => {
      setTrainingInfo(data);
    },
    refetchInterval: 5000,
    enabled: isTraining,
  });

  const getProgress = () => {
    if (trainingInfo.progress === null) {
      return null;
    }
    let progress = trainingInfo.progress * 0.8;
    progress += trainingInfo.status === 'Training' ? 10 : 0;
    progress += trainingInfo.status === 'Exporting' ? 10 : 0;
    progress = trainingInfo.status === 'Completed' ? 100 : progress;
    return progress;
  };

  useEffect(() => {
    setIsTraining(
      !(trainingInfo.status === null || trainingInfo.status === 'Idle')
    );
  }, [trainingInfo.status]);

  return (
    <TrainingInfoContext.Provider
      value={{
        ...trainingInfo,
        progress: getProgress(),
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
