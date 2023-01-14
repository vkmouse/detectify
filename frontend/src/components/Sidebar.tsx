import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled, { DefaultTheme } from 'styled-components';
import darkTheme from '../themes/dark';
import lightTheme from '../themes/light';
import { useThemeToggleContext } from '../themes/Theme';
import ThemeToggler from './ToggleSwitch';

const SidebarContainer = styled.div`
  position: fixed;
  width: 260px;
  height: 100vh;
  background: #293042;
  color: white;
`;

const SidebarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const SidebarBrandContainer = styled.a`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1.15rem 1.5rem;
`;

const SidebarBrandText = styled.span`
  font-size: 1.25rem;
  font-weight: 500;
`;

const HorizontalLine = styled.hr`
  width: 80%;
  border-color: ${(props) => props.theme.colors.gray500};
`;

const activeColor = `
  color: #568fed;
  &:hover {
    color: #568fed;
  }
`;

const inactiveColor = (theme: DefaultTheme) => `
  color: ${theme.colors.gray500};
  &:hover {
    color: ${theme.colors.gray700};
  }
`;

const SidebarLinkContainer = styled.div<{ isActive?: boolean }>`
  display: flex;
  justify-content: space-between;
  padding: 0.625rem 1.625rem;
  cursor: pointer;
  ${({ isActive, theme }) => (isActive ? activeColor : inactiveColor(theme))}
`;

const SidebarLinkAside = styled.div`
  display: flex;
  align-items: center;
`;

const SidebarLinkIcon = styled.img`
  width: 18px;
  height: 18px;
  padding-right: 12px;
  user-select: none;
`;

const SidebarLinkBadge = styled.div`
  right: 20px;
  top: 12px;
  background: #3f80ea;
  padding: 1px 3px;
  border-radius: 3px;
  text-align: center;
  color: white;
`;

const SidebarBrand = () => {
  return (
    <SidebarBrandContainer href="/">
      <SidebarBrandText>Project Name</SidebarBrandText>
    </SidebarBrandContainer>
  );
};

const SidebarLink = (props: {
  active?: boolean;
  children?: string | JSX.Element;
  badge?: string | number;
  icon?: string;
  href: string;
}) => {
  const { active, children, badge, icon, href } = props;

  return (
    <Link to={href}>
      <SidebarLinkContainer isActive={active}>
        <SidebarLinkAside>
          <SidebarLinkIcon src={icon}></SidebarLinkIcon>
          <span>{children}</span>
        </SidebarLinkAside>
        {badge ? <SidebarLinkBadge>{badge}</SidebarLinkBadge> : <></>}
      </SidebarLinkContainer>
    </Link>
  );
};

const SidebarFooter = styled.div`
  display: flex;
  align-items: end;
  height: 300px;
  flex-grow: 1;
`;

const ThemeToggleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding-bottom: 10px;
`;

const ThemeToggleText = styled.div`
  padding: 10px;
`;

const Sidebar = () => {
  const location = useLocation();
  const { setTheme } = useThemeToggleContext();

  return (
    <SidebarContainer>
      <SidebarWrapper>
        <SidebarBrand />
        <HorizontalLine />
        <SidebarLink active={location.pathname === '/'} href="/" badge={12}>
          Overview
        </SidebarLink>
        <SidebarLink active={location.pathname === '/images'} href="/images">
          Images
        </SidebarLink>
        <SidebarLink
          active={location.pathname === '/annotate'}
          href="/annotate"
        >
          Annotate
        </SidebarLink>
        <SidebarLink active={location.pathname === '/dataset'} href="/dataset">
          Dataset
        </SidebarLink>
        <SidebarLink active={location.pathname === '/model'} href="/model">
          Model
        </SidebarLink>
        <SidebarFooter>
          <ThemeToggleContainer>
            <ThemeToggleText>Light</ThemeToggleText>
            <ThemeToggler
              onChange={(isDarkTheme) => {
                if (isDarkTheme) {
                  setTheme(darkTheme);
                } else {
                  setTheme(lightTheme);
                }
              }}
            />
            <ThemeToggleText>Dark</ThemeToggleText>
          </ThemeToggleContainer>
        </SidebarFooter>
      </SidebarWrapper>
    </SidebarContainer>
  );
};

export default Sidebar;
