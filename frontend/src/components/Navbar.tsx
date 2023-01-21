import styled from 'styled-components';
import useLoginRedirect from '../hooks/useLoginRedirect';
import useLogout from '../hooks/useLogout';
import useUserInfo from '../hooks/useUserInfo';

const NavbarContainer = styled.nav`
  position: fixed;
  width: calc(100vw - 260px);
  margin-left: 260px;
  background-color: red;
`;

const NavbarInnerContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 14px 20px;
`;

const NavbarItems = styled.div``;

const NavbarToggler = styled.button``;

const Navbar = () => {
  const { isFetching, userInfo } = useUserInfo();
  const loginRedirect = useLoginRedirect();
  const logout = useLogout(() => loginRedirect(false));

  return (
    <NavbarContainer>
      <NavbarInnerContainer>
        <NavbarItems>Projects</NavbarItems>
        <NavbarToggler onClick={logout}>
          {isFetching ? 'isFetching' : userInfo && userInfo.name}
        </NavbarToggler>
      </NavbarInnerContainer>
    </NavbarContainer>
  );
};

export default Navbar;
