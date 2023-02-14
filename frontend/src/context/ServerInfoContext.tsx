import { useQuery, useQueryClient } from '@tanstack/react-query';
import { createContext, ReactNode, useContext, useState } from 'react';
import api from '../api/api';

type State = {
  serverStatus: string;
  defaultServerStatus: string;
  reloadServerStatus: () => void;
  reloadDefaultServerStatus: () => void;
};

const initialState: State = {
  serverStatus: '',
  defaultServerStatus: '',
  reloadServerStatus: () => void 0,
  reloadDefaultServerStatus: () => void 0,
};

const ServeInfoContext = createContext<State>(initialState);

const ServerInfoProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();
  const [defaultServerStatus, setDefaultServerStatus] = useState('Pending');
  const [serverStatus, setServerStatus] = useState('Not Created');

  useQuery({
    queryKey: ['defaultServerStatus'],
    queryFn: () => {
      setDefaultServerStatus('');
      return api.getDefaultServerStatus();
    },
    onSuccess: (data) => setDefaultServerStatus(data.status),
  });

  useQuery({
    queryKey: ['serverStatus'],
    queryFn: () => {
      setServerStatus('');
      return api.getServerStatus();
    },
    onSuccess: (data) => setServerStatus(data.status),
  });

  const reloadServerStatus = () => {
    queryClient.invalidateQueries(['serverStatus']);
  };

  const reloadDefaultServerStatus = () => {
    queryClient.invalidateQueries(['defaultServerStatus']);
  };

  return (
    <ServeInfoContext.Provider
      value={{
        defaultServerStatus,
        serverStatus,
        reloadServerStatus,
        reloadDefaultServerStatus,
      }}
    >
      {children}
    </ServeInfoContext.Provider>
  );
};

const useServerInfo = (): State => {
  return useContext(ServeInfoContext);
};

export { useServerInfo, ServerInfoProvider };
