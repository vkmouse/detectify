import { AxiosError } from 'axios';
import api from '../api/api';
import { useAppDispatch } from '../store/store';
import { reset, setUser, startFetching } from '../store/userSlice';
import { APIResponse, APIResponseStatus, LoginRequest } from '../types/api';

const useLogin = (props: {
  onSuccess?: () => void;
  onEmailNotExist?: () => void;
  onPasswordError?: () => void;
}) => {
  const { onSuccess, onEmailNotExist, onPasswordError } = props;
  const dispatch = useAppDispatch();

  const login = async (props: LoginRequest) => {
    dispatch(startFetching());
    try {
      await api.login(props);
      const userInfo = await api.getUserInfo();
      if (userInfo) {
        dispatch(setUser(userInfo));
        onSuccess?.();
      }
    } catch (data) {
      const err = data as AxiosError;
      const body = err?.response?.data as APIResponse | undefined;
      if (body?.status === APIResponseStatus.ERROR_EMAIL_NOT_EXIST)
        onEmailNotExist?.();
      else if (body?.status === APIResponseStatus.ERROR_PASSWORD_ERROR) {
        onPasswordError?.();
      }
      dispatch(reset());
    }
  };

  return login;
};

export default useLogin;
