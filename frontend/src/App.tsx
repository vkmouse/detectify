import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProjectContainer from './components/ProjectContainer';
import Sidebar from './components/Sidebar';
import { SignUpPage, SignInPage } from './pages/AuthPage';
import HomePage from './pages/HomePage';
import ProjectImagePage from './pages/ProjectImagePage';

const ProjectElement = (props: { element: JSX.Element }) => {
  const { element } = props;
  return (
    <>
      <Navbar />
      <Sidebar />
      <ProjectContainer>{element}</ProjectContainer>
    </>
  );
};

const App = () => {
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
