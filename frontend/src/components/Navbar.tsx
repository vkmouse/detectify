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
import {
  mainContentMarginX,
  mainContentMaxWidth,
  navbarHeight,
} from './Layout';

const NavbarContainer = styled.nav`
  display: flex;
  justify-content: center;
  position: fixed;
  width: 100vw;
  background: #293042;
  color: white;
  box-shadow: 0 0 2rem 0 rgb(41 48 66 / 10%);
  z-index: 999;
`;

const NavbarInnerContainer = styled.div`
  display: flex;
  width: 100%;
  max-width: ${() => `${mainContentMaxWidth}px`};
  margin: 0 ${() => `${mainContentMarginX}px`};
  height: ${() => `${navbarHeight}px`};
  user-select: none;
`;

const NavbarBrand = styled(Link)`
  display: flex;
  align-items: center;
  max-width: 200px;
  width: 100%;
`;

const NavbarExpand = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding-left: 20px;
`;

const NavbarItems = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
`;

const NavbarItem = styled(Link)`
  display: flex;
  align-items: center;
  padding: 0 20px;
  height: 100%;
  cursor: pointer;
  &:hover {
    color: ${(props) => props.theme.colors.primary};
  }
  &:first-child {
    padding-left: 0;
  }
`;

const NavbarToggler = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  height: ${() => `${navbarHeight}px`};
  cursor: pointer;
`;

const DropdownMenu = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  position: absolute;
  right: 0;
  top: 100%;
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

const Navbar = () => {
  const { isFetching, userInfo } = useUserInfo();
  const loginRedirect = useLoginRedirect();
  const logout = useLogout(() => loginRedirect(false));
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <NavbarContainer>
      <NavbarInnerContainer>
        <NavbarBrand to="/">
          <LogoIcon width="35" height={navbarHeight} />
          <LogoText width="90" height={navbarHeight} />
        </NavbarBrand>
        <NavbarExpand>
          <NavbarItems>
            <NavbarItem to="/projects">Projects</NavbarItem>
            <NavbarItem to="/server">Server</NavbarItem>
          </NavbarItems>
          <NavbarCollapse>
            <ThemeToggler />
            <NavbarToggler
              onClick={() => {
                setShowDropdown((showDropdown) => !showDropdown);
              }}
            >
              {userInfo && (
                <>
                  <span>
                    {isFetching ? 'isFetching' : userInfo && userInfo.name}
                  </span>
                  <ChevronDown />
                  {showDropdown && (
                    <DropdownMenu>
                      <DropdownItem onClick={logout}>Sign out</DropdownItem>
                    </DropdownMenu>
                  )}
                </>
              )}
            </NavbarToggler>
          </NavbarCollapse>
        </NavbarExpand>
      </NavbarInnerContainer>
    </NavbarContainer>
  );
};

export default Navbar;
