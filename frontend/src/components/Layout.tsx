import styled from 'styled-components';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const NavbarContainer = styled.div`
  padding-top: 85px;
`;

const NavbarSidebarContainer = styled(NavbarContainer)`
  padding-left: 260px;
`;

const NavbarLayout = (props: {
  children: string | JSX.Element | JSX.Element[];
}) => {
  const { children } = props;
  return (
    <>
      <Navbar />
      <NavbarContainer>{children}</NavbarContainer>
    </>
  );
};

const NavbarSidebarLayout = (props: {
  children?: string | JSX.Element | JSX.Element[];
}) => {
  const { children } = props;
  return (
    <>
      <Navbar />
      <Sidebar />
      <NavbarSidebarContainer>{children}</NavbarSidebarContainer>
    </>
  );
};

export { NavbarLayout, NavbarSidebarLayout };
