import styled from 'styled-components';
import useLoginRedirect from '../hooks/useLoginRedirect';
import useLogout from '../hooks/useLogout';
import useUserInfo from '../hooks/useUserInfo';
import ChevronDown from '../assets/chevron-down.svg';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const NavbarContainer = styled.nav`
  position: fixed;
  width: 100vw;
  background: #293042;
  color: white;
  box-shadow: 0 0 2rem 0 rgb(41 48 66 / 10%);
  z-index: 999;
`;

const NavbarInnerContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 70px;
`;

const NavbarItems = styled.div`
  display: flex;
`;

const NavbarItem = styled(Link)`
  user-select: none;
  padding: 5px 15px;
  cursor: pointer;
  &:hover {
    color: ${(props) => props.theme.colors.primary};
  }
`;

const NavbarToggler = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  padding: 8px;
  cursor: pointer;
`;

const DropdownMenu = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  position: absolute;
  right: 0;
  top: 70px;
  color: ${(props) => props.theme.colors.bodyColor};
  background-color: ${(props) => props.theme.colors.navBackground};
  border: 1px solid ${(props) => props.theme.colors.dropdownBorderColor};
  white-space: nowrap;
`;

const DropdownItem = styled.span`
  padding: 5px 24px;
  user-select: none;
  cursor: pointer;
  &:hover {
    background: ${(props) => props.theme.colors.dropdownHover};
  }
`;

const Navbar = () => {
  const { isFetching, userInfo } = useUserInfo();
  const loginRedirect = useLoginRedirect();
  const logout = useLogout(() => loginRedirect(false));
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <NavbarContainer>
      <NavbarInnerContainer>
        <NavbarItems>
          <NavbarItem to="/">Home</NavbarItem>
          <NavbarItem to="/projects">Projects</NavbarItem>
        </NavbarItems>
        <NavbarToggler
          onClick={() => {
            setShowDropdown((showDropdown) => !showDropdown);
          }}
        >
          <span>{isFetching ? 'isFetching' : userInfo && userInfo.name}</span>
          <ChevronDown />
        </NavbarToggler>{' '}
        {showDropdown && (
          <DropdownMenu>
            <DropdownItem>Profile</DropdownItem>
            <DropdownItem onClick={logout}>Sign out</DropdownItem>
          </DropdownMenu>
        )}
      </NavbarInnerContainer>
    </NavbarContainer>
  );
};

export default Navbar;
