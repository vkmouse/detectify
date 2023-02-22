import { createBrowserRouter, Outlet } from 'react-router-dom';
import { NavbarLayout, NavbarSidebarLayout } from './components/Layout';
import { AnnotationProvider } from './context/AnnotationContext';
import { ProjectInfoProvider } from './context/ProjectInfoContext';
import { ServerInfoProvider } from './context/ServerInfoContext';
import AnnotatePage from './pages/AnnotatePage';
import { SignInPage, SignUpPage } from './pages/AuthPage';
import HomePage from './pages/HomePage';
import ImagePage from './pages/ImagePage';
import PredictPage from './pages/PredictPage';
import Projects from './pages/ProjectsPage';
import ServerPage from './pages/ServerPage';
import TrainPage from './pages/TrainPage';

export const router = createBrowserRouter([
  {
    element: <ContextWrapper />,
    path: '/',
    children: [
      {
        children: [
          { path: 'signup', element: <SignUpPage /> },
          { path: 'signin', element: <SignInPage /> },
        ],
      },
      {
        element: <NavbarLayoutWrapper />,
        children: [
          { path: 'projects', element: <Projects /> },
          { path: 'server', element: <ServerPage /> },
          { path: '/', element: <HomePage /> },
        ],
      },
      {
        path: '/project/:projectId',
        element: <NavbarSidebarLayoutWrapper />,
        children: [
          { path: 'images', element: <ImagePage /> },
          { path: 'annotate', element: <AnnotatePage /> },
          { path: 'train', element: <TrainPage /> },
          { path: 'predict', element: <PredictPage /> },
        ],
      },
    ],
  },
]);

function ContextWrapper() {
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css?family=Poppins"
        rel="stylesheet"
      />
      <Outlet />
    </>
  );
}

function NavbarLayoutWrapper() {
  return (
    <ServerInfoProvider>
      <NavbarLayout />
    </ServerInfoProvider>
  );
}

function NavbarSidebarLayoutWrapper() {
  return (
    <ServerInfoProvider>
      <ProjectInfoProvider>
        <AnnotationProvider>
          <NavbarSidebarLayout />
        </AnnotationProvider>
      </ProjectInfoProvider>
    </ServerInfoProvider>
  );
}
