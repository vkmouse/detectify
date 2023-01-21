import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../store/store';

const publicPages = ['/signin', '/signup'];

const useLoginRedirect = () => {
  const navigate = useNavigate();
  const { isInit, isFetching, userInfo } = useAppSelector(
    (state) => state.user
  );

  const loginRedirect = (isAuth: boolean) => {
    const isAuthPage = !publicPages.includes(window.location.pathname);

    if (!isAuth && isAuthPage) {
      navigate('/signin');
    } else if (isAuth && !isAuthPage) {
      navigate('/');
    }
  };

  useEffect(() => {
    if (isInit && !isFetching) {
      const isAuth = userInfo !== null;
      loginRedirect(isAuth);
    }
  }, [isInit, isFetching, userInfo]);

  return loginRedirect;
};

export default useLoginRedirect;
