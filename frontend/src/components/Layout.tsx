import styled from 'styled-components';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Container = styled.div`
  padding: 85px 260px;
`;

const NavbarLayout = (props: {
  children: string | JSX.Element | JSX.Element[];
}) => {
  const { children } = props;
  return (
    <>
      <Navbar />
      <Container>{children}</Container>
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
      <Container>{children}</Container>
    </>
  );
};

export { NavbarLayout, NavbarSidebarLayout };
