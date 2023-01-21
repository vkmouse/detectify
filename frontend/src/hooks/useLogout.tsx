import api from '../api/api';
import { useAppDispatch } from '../store/store';
import { reset, startFetching } from '../store/userSlice';

const useLogout = (onSuccess?: () => void) => {
  const dispatch = useAppDispatch();

  const logout = async () => {
    dispatch(startFetching());
    await api.logout();
    dispatch(reset());
    onSuccess?.();
  };

  return logout;
};

export default useLogout;
