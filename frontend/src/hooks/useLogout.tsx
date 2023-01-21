import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { useAppDispatch } from '../store/store';
import { reset, startFetching } from '../store/userSlice';

const useLogout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const logout = async () => {
    dispatch(startFetching());
    await api.logout();
    dispatch(reset());
    navigate('/signin');
  };

  return logout;
};

export default useLogout;
