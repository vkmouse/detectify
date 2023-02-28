import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import { useProjectInfo } from '../context/ProjectInfoContext';
import { LoadingModal } from './Loading';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const navbarHeight = 70;
const sidebarWidth = 200;
const sidebarMinWidth = 32;
const mainContentMaxWidth = 1200;
const mainContentMarginX = 25;

const Main = styled.main`
  display: flex;
  justify-content: center;
`;

const Container = styled.div`
  width: 100%;
  max-width: ${mainContentMaxWidth}px;
  margin: 0 ${() => `${mainContentMarginX}px`};
  padding-bottom: 200px;
`;

const NavbarContainer = styled.div`
  padding-top: ${navbarHeight + 20}px;
`;

const NavbarSidebarContainer = styled(NavbarContainer)`
  padding-left: ${sidebarWidth + 20}px;
  @media (max-width: 960px) {
    padding-left: ${sidebarMinWidth + 20}px;
  }
`;

const NavbarLayout = () => {
  return (
    <Main>
      <Navbar />
      <Container>
        <NavbarContainer>
          <Outlet />
        </NavbarContainer>
      </Container>
    </Main>
  );
};

const NavbarSidebarLayout = () => {
  const { isLoading: isProjectImagesLoading } = useProjectInfo();
  return (
    <Main>
      <Navbar />
      <Container>
        <Sidebar />
        <NavbarSidebarContainer>
          <LoadingModal isLoading={isProjectImagesLoading} />
          <Outlet />
        </NavbarSidebarContainer>
      </Container>
    </Main>
  );
};

export {
  NavbarLayout,
  NavbarSidebarLayout,
  navbarHeight,
  sidebarWidth,
  sidebarMinWidth,
  mainContentMaxWidth,
  mainContentMarginX,
};
