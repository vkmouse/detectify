import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const navbarHeight = 70;
const sidebarWidth = 200;
const mainContentMaxWidth = 1200;
const mainContentMarginX = 25;

const Main = styled.main`
  display: flex;
  justify-content: center;
  width: 100vw;
`;

const Container = styled.div`
  width: 100%;
  max-width: ${mainContentMaxWidth}px;
  margin: 0 ${() => `${mainContentMarginX}px`};
`;

const NavbarContainer = styled.div`
  padding-top: ${navbarHeight + 20}px;
`;

const NavbarSidebarContainer = styled(NavbarContainer)`
  padding-left: ${sidebarWidth + 20}px;
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
  return (
    <Main>
      <Navbar />
      <Container>
        <Sidebar />
        <NavbarSidebarContainer>
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
  mainContentMaxWidth,
  mainContentMarginX,
};
