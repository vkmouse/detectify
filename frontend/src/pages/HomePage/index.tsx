import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/projects');
  }, []);
  return <></>;
};

export default HomePage;
