import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProjectContainer from './components/ProjectContainer';
import Sidebar from './components/Sidebar';
import ImagePage from './pages/ImagePage';
import ProjectImagePage from './pages/ProjectImagePage';
import Theme from './themes/Theme';

const queryClient = new QueryClient();

const App = () => {
  return (
    <Theme>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Sidebar />
          <ProjectContainer>
            <Routes>
              <Route path="/">
                <Route path="model" element={<ImagePage />} />
                <Route path="images" element={<ProjectImagePage />} />
              </Route>
            </Routes>
          </ProjectContainer>
        </Router>
      </QueryClientProvider>
    </Theme>
  );
};

export default App;
