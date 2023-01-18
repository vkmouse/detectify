import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProjectContainer from './components/ProjectContainer';
import Sidebar from './components/Sidebar';
import ProjectImagePage from './pages/ProjectImagePage';
import SignUpPage from './pages/AuthPage/SignUpPage';
import Theme from './themes/Theme';

const queryClient = new QueryClient();

const ProjectElement = (props: { element: JSX.Element }) => {
  const { element } = props;
  return (
    <>
      <Sidebar />
      <ProjectContainer>{element}</ProjectContainer>
    </>
  );
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/">
        <Route index element={<ProjectElement element={<></>} />} />
        <Route
          path="images"
          element={<ProjectElement element={<ProjectImagePage />} />}
        />
        <Route path="annotate" element={<ProjectElement element={<></>} />} />
        <Route path="dataset" element={<ProjectElement element={<></>} />} />
        <Route path="model" element={<ProjectElement element={<></>} />} />
        <Route path="signup" element={<SignUpPage />} />
      </Route>
    </Routes>
  );
};

const App = () => {
  return (
    <Theme>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </QueryClientProvider>
    </Theme>
  );
};

export default App;
