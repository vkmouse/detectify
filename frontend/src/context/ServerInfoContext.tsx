import { useQuery } from '@tanstack/react-query';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import api from '../api/api';

type State = {
  serverStatus: string;
  defaultServerStatus: string;
};

const initialState: State = {
  serverStatus: '',
  defaultServerStatus: '',
};

const ServeInfoContext = createContext<State>(initialState);

const ServerInfoProvider = ({ children }: { children: ReactNode }) => {
  const [defaultServerStatus, setDefaultServerStatus] = useState('Pending');
  const [serverStatus, setServerStatus] = useState('Not Created');

  useEffect(() => {
    api.getDefaultServerStatus().then((data) => {
      setDefaultServerStatus(data.status);
    });
  }, []);

  useQuery({
    queryKey: ['serverStatus'],
    queryFn: api.getServerStatus,
    onSuccess: (data) => setServerStatus(data.status),
  });

  return (
    <ServeInfoContext.Provider value={{ defaultServerStatus, serverStatus }}>
      {children}
    </ServeInfoContext.Provider>
  );
};

const useServerInfo = (): State => {
  return useContext(ServeInfoContext);
};

export { useServerInfo, ServerInfoProvider };
