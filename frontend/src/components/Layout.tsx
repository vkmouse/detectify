import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const NavbarContainer = styled.div`
  padding-top: 85px;
`;

const NavbarSidebarContainer = styled(NavbarContainer)`
  padding-left: 260px;
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

export { NavbarLayout, NavbarSidebarLayout };
