import styled from 'styled-components';
import useLoginRedirect from '../hooks/useLoginRedirect';
import useLogout from '../hooks/useLogout';
import useUserInfo from '../hooks/useUserInfo';
import ChevronDown from '../assets/chevron-down.svg';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import ThemeToggler from './ThemeToggler';
import LogoIcon from '../assets/logo-icon.svg';
import LogoText from '../assets/logo-text.svg';
import { navbarHeight } from './Layout';

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
  padding: 0 10px;
  height: ${() => `${navbarHeight}px`};
  user-select: none;
`;

const NavbarItems = styled.div`
  display: flex;
  align-items: center;
`;

const NavbarItem = styled(Link)`
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
  top: ${() => `${navbarHeight}px`};
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

const NavbarCollapse = styled.div`
  display: flex;
  align-items: center;
`;

const NavbarBrand = styled(Link)`
  display: flex;
  align-items: center;
  padding-right: 10px;
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
          <NavbarBrand to="/">
            <LogoIcon width="35" height={navbarHeight} />
            <LogoText width="90" height={navbarHeight} />
          </NavbarBrand>
          <NavbarItem to="/projects">Projects</NavbarItem>
        </NavbarItems>
        <NavbarCollapse>
          <ThemeToggler />
          <NavbarToggler
            onClick={() => {
              setShowDropdown((showDropdown) => !showDropdown);
            }}
          >
            <span>{isFetching ? 'isFetching' : userInfo && userInfo.name}</span>
            <ChevronDown />
          </NavbarToggler>
          {showDropdown && (
            <DropdownMenu>
              <DropdownItem>Profile</DropdownItem>
              <DropdownItem onClick={logout}>Sign out</DropdownItem>
            </DropdownMenu>
          )}
        </NavbarCollapse>
      </NavbarInnerContainer>
    </NavbarContainer>
  );
};

export default Navbar;
