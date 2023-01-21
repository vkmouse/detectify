import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api/api';
import { useAppDispatch, useAppSelector } from '../store/store';
import { reset, setUser, startFetching } from '../store/userSlice';

const useUserInfo = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isFetching, userInfo } = useAppSelector((state) => state.user);

  const updateUserInfo = async () => {
    dispatch(startFetching());
    const data = await api.getUserInfo();
    if (data) {
      dispatch(setUser(data));
      navigate('/');
      return;
    }
    dispatch(reset());
    if (location.pathname !== '/signin' && location.pathname !== '/signup') {
      navigate('/signin');
    }
  };

  useEffect(() => {
    if (!isFetching) {
      if (userInfo === null) {
        updateUserInfo();
      }
    }
  }, [isFetching, userInfo]);

  return { isFetching, userInfo };
};

export default useUserInfo;
