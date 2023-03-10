import { createBrowserRouter, Outlet } from 'react-router-dom';
import { NavbarLayout, NavbarSidebarLayout } from './components/Layout';
import ProjectPageContainer from './components/ProjectPageContainer';
import { AnnotationProvider } from './context/AnnotationContext';
import { ProjectInfoProvider } from './context/ProjectInfoContext';
import { ServerInfoProvider } from './context/ServerInfoContext';
import { TrainingInfoProvider } from './context/TrainingInfoContext';
import AnnotatePage from './pages/AnnotatePage';
import { SignInPage, SignUpPage } from './pages/AuthPage';
import HomePage from './pages/HomePage';
import ImagePage from './pages/ImagePage';
import PredictPage from './pages/OverviewPage';
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
          {
            path: '',
            element: (
              <ProjectPageContainer name="Overview">
                <PredictPage />
              </ProjectPageContainer>
            ),
          },
          {
            path: 'images',
            element: (
              <ProjectPageContainer name="Image">
                <ImagePage />
              </ProjectPageContainer>
            ),
          },
          {
            path: 'annotate',
            element: (
              <ProjectPageContainer name="Annotate">
                <AnnotatePage />
              </ProjectPageContainer>
            ),
          },
          {
            path: 'train',
            element: (
              <ProjectPageContainer name="Train">
                <TrainPage />
              </ProjectPageContainer>
            ),
          },
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
      <TrainingInfoProvider>
        <NavbarLayout />
      </TrainingInfoProvider>
    </ServerInfoProvider>
  );
}

function NavbarSidebarLayoutWrapper() {
  return (
    <ServerInfoProvider>
      <TrainingInfoProvider>
        <ProjectInfoProvider>
          <AnnotationProvider>
            <NavbarSidebarLayout />
          </AnnotationProvider>
        </ProjectInfoProvider>
      </TrainingInfoProvider>
    </ServerInfoProvider>
  );
}
