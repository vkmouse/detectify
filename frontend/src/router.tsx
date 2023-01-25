import { createBrowserRouter, Outlet } from 'react-router-dom';
import { NavbarLayout, NavbarSidebarLayout } from './components/Layout';
import { SignInPage, SignUpPage } from './pages/AuthPage';
import HomePage from './pages/HomePage';
import ProjectImagePage from './pages/ProjectImagePage';
import Projects from './pages/Projects';

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
        element: <NavbarSidebarLayout />,
        children: [
          { path: 'images', element: <ProjectImagePage /> },
          { path: 'annotate', element: <></> },
          { path: 'dataset', element: <></> },
          { path: 'model', element: <></> },
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
