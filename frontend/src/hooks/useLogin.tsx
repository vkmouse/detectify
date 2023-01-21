import api from '../api/api';
import { useAppDispatch } from '../store/store';
import { reset, setUser, startFetching } from '../store/userSlice';
import { APIResponseStatus, LoginRequest } from '../types/api';

const useLogin = (props: {
  onSuccess?: () => void;
  onEmailNotExist?: () => void;
  onPasswordError?: () => void;
}) => {
  const { onSuccess, onEmailNotExist, onPasswordError } = props;
  const dispatch = useAppDispatch();

  const login = async (props: LoginRequest) => {
    dispatch(startFetching());
    const response = await api.login(props);

    switch (response.status) {
      case APIResponseStatus.SUCCESS: {
        const userInfo = await api.getUserInfo();
        if (userInfo) {
          dispatch(setUser(userInfo));
          onSuccess?.();
        }
        return;
      }
      case APIResponseStatus.ERROR_EMAIL_NOT_EXIST: {
        onEmailNotExist?.();
        break;
      }
      case APIResponseStatus.ERROR_PASSWORD_ERROR: {
        onPasswordError?.();
        break;
      }
    }
    dispatch(reset());
  };

  return login;
};

export default useLogin;
