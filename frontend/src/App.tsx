import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { NavbarLayout, NavbarSidebarLayout } from './components/Layout';
import { SignUpPage, SignInPage } from './pages/AuthPage';
import HomePage from './pages/HomePage';
import ProjectImagePage from './pages/ProjectImagePage';
import Projects from './pages/Projects';

const App = () => {
  return (
    <Routes>
      <Route path="/">
        <Route
          index
          element={
            <NavbarSidebarLayout>
              <HomePage />
            </NavbarSidebarLayout>
          }
        />
        <Route
          path="images"
          element={
            <NavbarSidebarLayout>
              <ProjectImagePage />
            </NavbarSidebarLayout>
          }
        />
        <Route path="annotate" element={<NavbarSidebarLayout />} />
        <Route path="dataset" element={<NavbarSidebarLayout />} />
        <Route path="model" element={<NavbarSidebarLayout />} />
        <Route path="signup" element={<SignUpPage />} />
        <Route path="signin" element={<SignInPage />} />
        <Route
          path="projects"
          element={
            <NavbarLayout>
              <Projects />
            </NavbarLayout>
          }
        />
      </Route>
    </Routes>
  );
};

export default App;
