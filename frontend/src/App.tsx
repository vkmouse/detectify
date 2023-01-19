import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import api from './api/api';
import ProjectContainer from './components/ProjectContainer';
import Sidebar from './components/Sidebar';
import { SignUpPage, SignInPage } from './pages/AuthPage';
import HomePage from './pages/HomePage';
import ProjectImagePage from './pages/ProjectImagePage';
import { useAppDispatch } from './store/store';
import { setUser, startLoading } from './store/userSlice';

const ProjectElement = (props: { element: JSX.Element }) => {
  const { element } = props;
  return (
    <>
      <Sidebar />
      <ProjectContainer>{element}</ProjectContainer>
    </>
  );
};

const App = () => {
  const dispatch = useAppDispatch();
  const updateUserInfo = async () => {
    const accessToken = window.localStorage.getItem('accessToken');
    if (accessToken) {
      dispatch(startLoading());
      const data = await api.getUserInfo();
      dispatch(setUser(data));
    }
  };

  useEffect(() => {
    updateUserInfo();
  });

  return (
    <Routes>
      <Route path="/">
        <Route index element={<ProjectElement element={<HomePage />} />} />
        <Route
          path="images"
          element={<ProjectElement element={<ProjectImagePage />} />}
        />
        <Route path="annotate" element={<ProjectElement element={<></>} />} />
        <Route path="dataset" element={<ProjectElement element={<></>} />} />
        <Route path="model" element={<ProjectElement element={<></>} />} />
        <Route path="signup" element={<SignUpPage />} />
        <Route path="signin" element={<SignInPage />} />
      </Route>
    </Routes>
  );
};

export default App;
