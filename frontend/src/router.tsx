import { createBrowserRouter, Outlet } from 'react-router-dom';
import { NavbarLayout, NavbarSidebarLayout } from './components/Layout';
import { ProjectInfoProvider } from './context/ProjectInfoContext';
import { SignInPage, SignUpPage } from './pages/AuthPage';
import HomePage from './pages/HomePage';
import ProjectImagePage from './pages/Project/ImagePage';
import ModelPage from './pages/Project/ModelPage';
import OverviewPage from './pages/Project/OverviewPage';
import Projects from './pages/ProjectsPage';

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
          { path: '', element: <OverviewPage /> },
          { path: 'images', element: <ProjectImagePage /> },
          { path: 'annotate', element: <>annotate</> },
          { path: 'dataset', element: <>dataset</> },
          { path: 'model', element: <ModelPage /> },
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
