import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const navbarHeight = 70;
const sidebarWidth = 260;

const NavbarContainer = styled.div`
  padding-top: ${navbarHeight}px;
`;

const NavbarSidebarContainer = styled(NavbarContainer)`
  padding-left: ${sidebarWidth}px;
`;

const NavbarLayout = () => {
  return (
    <>
      <Navbar />
      <NavbarContainer>
        <Outlet />
      </NavbarContainer>
    </>
  );
};

const NavbarSidebarLayout = () => {
  return (
    <>
      <Navbar />
      <Sidebar />
      <NavbarSidebarContainer>
        <Outlet />
      </NavbarSidebarContainer>
    </>
  );
};

export { NavbarLayout, NavbarSidebarLayout, navbarHeight, sidebarWidth };
