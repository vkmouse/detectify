import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../store/store';

const HomePage = () => {
  const navigate = useNavigate();
  const { isLoading, userInfo } = useAppSelector((state) => state.user);

  useEffect(() => {
    if (!isLoading && userInfo === null) {
      navigate('/signin');
    }
  }, [isLoading, navigate, userInfo]);

  return <></>;
};

export default HomePage;
