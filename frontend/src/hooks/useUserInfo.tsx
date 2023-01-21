import { useEffect } from 'react';
import api from '../api/api';
import { useAppDispatch, useAppSelector } from '../store/store';
import { reset, setUser, startFetching } from '../store/userSlice';

const useUserInfo = () => {
  const dispatch = useAppDispatch();
  const { isInit, isFetching, userInfo } = useAppSelector(
    (state) => state.user
  );

  const updateUserInfo = async () => {
    dispatch(startFetching());
    const data = await api.getUserInfo();
    if (data) {
      dispatch(setUser(data));
    } else {
      dispatch(reset());
    }
  };

  useEffect(() => {
    if (!isInit && userInfo === null) {
      updateUserInfo();
    }
  }, []);

  return { isFetching, userInfo };
};

export default useUserInfo;
