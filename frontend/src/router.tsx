import { createBrowserRouter, Outlet } from 'react-router-dom';
import { NavbarLayout, NavbarSidebarLayout } from './components/Layout';
import { ProjectInfoProvider } from './context/ProjectInfoContext';
import AnnotatePage from './pages/AnnotatePage';
import { SignInPage, SignUpPage } from './pages/AuthPage';
import HomePage from './pages/HomePage';
import ImagePage from './pages/ImagePage';
import PredictPage from './pages/PredictPage';
import Projects from './pages/ProjectsPage';
import ServerPage from './pages/ServerPage';

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
        element: <NavbarLayout />,
        children: [
          { path: 'projects', element: <Projects /> },
          { path: '/', element: <HomePage /> },
        ],
      },
      {
        path: '/project/:projectId',
        element: <NavbarSidebarLayoutWrapper />,
        children: [
          { path: 'images', element: <ImagePage /> },
          { path: 'annotate', element: <AnnotatePage /> },
          { path: 'train', element: <>train</> },
          { path: 'predict', element: <PredictPage /> },
          { path: 'server', element: <ServerPage /> },
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

function NavbarSidebarLayoutWrapper() {
  return (
    <ProjectInfoProvider>
      <NavbarSidebarLayout />
    </ProjectInfoProvider>
  );
}
