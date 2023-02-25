import { useQuery, useQueryClient } from '@tanstack/react-query';
import { createContext, ReactNode, useContext, useState } from 'react';
import api from '../api/api';

type State = {
  token: string | null;
  isServerAlive: boolean;
  isDefaultServerAlive: boolean;
  reloadIsServerAlive: () => void;
  reloadIsDefaultServerAlive: () => void;
};

const initialState: State = {
  token: null,
  isServerAlive: false,
  isDefaultServerAlive: false,
  reloadIsServerAlive: () => void 0,
  reloadIsDefaultServerAlive: () => void 0,
};

const ServeInfoContext = createContext<State>(initialState);

const ServerInfoProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();
  const [isDefaultServerAlive, setIsDefaultServerAlive] = useState(false);
  const [isServerAlive, setIsServerAlive] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useQuery({
    queryKey: ['isDefaultServerAlive'],
    queryFn: () => {
      setIsDefaultServerAlive(false);
      return api.getDefaultServerAlive();
    },
    onSuccess: (data) => setIsDefaultServerAlive(data.alive),
  });

  useQuery({
    queryKey: ['isServerAlive'],
    queryFn: () => {
      setIsServerAlive(false);
      return api.getServerAlive();
    },
    onSuccess: (data) => {
      setToken(data.token);
      setIsServerAlive(data.alive);
    },
  });

  const reloadIsServerAlive = () => {
    queryClient.invalidateQueries(['isServerAlive']);
  };

  const reloadIsDefaultServerAlive = () => {
    queryClient.invalidateQueries(['isDefaultServerAlive']);
  };

  return (
    <ServeInfoContext.Provider
      value={{
        token,
        isDefaultServerAlive: isDefaultServerAlive,
        isServerAlive: isServerAlive,
        reloadIsServerAlive,
        reloadIsDefaultServerAlive,
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
