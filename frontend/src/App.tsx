import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProjectContainer from './components/ProjectContainer';
import Sidebar from './components/Sidebar';
import ImagePage from './pages/ImagePage';
import Theme from './themes/Theme';

const App = () => {
  return (
    <Theme>
      <Router>
        <Sidebar />
        <ProjectContainer>
          <Routes>
            <Route path="/">
              <Route path="images" element={<ImagePage />} />
            </Route>
          </Routes>
        </ProjectContainer>
      </Router>
    </Theme>
  );
};

export default App;
