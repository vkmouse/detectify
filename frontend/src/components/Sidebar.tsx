import React, { useState } from 'react';
import { Link, LinkProps as RouterLinkProps } from 'react-router-dom';
import styled, { DefaultTheme } from 'styled-components';
import TrendingUpIcon from '../assets/trending-up.svg';
import GridIcon from '../assets/grid.svg';
import ImageIcon from '../assets/image.svg';
import MaximizeIcon from '../assets/maximize.svg';
import { useProjectInfo } from '../context/ProjectInfoContext';
import { navbarHeight, sidebarMinWidth, sidebarWidth } from './Layout';

const SidebarContainer = styled.div`
  position: fixed;
  width: ${() => `${sidebarWidth}px`};
  height: 100vh;
  margin-top: ${() => `${navbarHeight}px`};
  background-color: ${(props) => props.theme.colors.bodyBackground};
  z-index: 999;
  @media (max-width: 960px) {
    width: ${() => `${sidebarMinWidth}px`};
  }
`;

const SidebarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const SidebarBrandContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 20px 0;
  @media (max-width: 960px) {
    display: none;
  }
`;

const SidebarBrandText = styled.span`
  font-size: 1.25rem;
  font-weight: 500;
`;

const HorizontalLine = styled.hr`
  border-color: ${(props) => props.theme.colors.gray500};
  margin: 0;
  @media (max-width: 960px) {
    display: none;
  }
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
  padding: 10px 0;
  cursor: pointer;
  ${({ isActive, theme }) => (isActive ? activeColor : inactiveColor(theme))}
`;

const SidebarLinkAside = styled.div`
  display: flex;
  align-items: center;
`;

const SidebarLinkBadge = styled.div`
  right: 20px;
  top: 12px;
  background: #3f80ea;
  padding: 1px 3px;
  border-radius: 3px;
  text-align: center;
  color: white;
  @media (max-width: 960px) {
    display: none;
  }
`;

const Text = styled.div`
  @media (max-width: 960px) {
    display: none;
  }
`;

const SidebarBrand = ({ name }: { name: string }) => {
  return (
    <SidebarBrandContainer>
      <SidebarBrandText>{name}</SidebarBrandText>
    </SidebarBrandContainer>
  );
};

interface LinkProps extends RouterLinkProps {
  active?: boolean;
  badge?: string | number;
}

const SidebarLink = ({ active, children, badge, ...rest }: LinkProps) => {
  return (
    <Link {...rest}>
      <SidebarLinkContainer isActive={active}>
        <SidebarLinkAside>{children}</SidebarLinkAside>
        {badge !== undefined && <SidebarLinkBadge>{badge}</SidebarLinkBadge>}
      </SidebarLinkContainer>
    </Link>
  );
};

const IconContainer = styled.div`
  display: flex;
  padding-right: 5px;
  user-select: none;
`;

const Sidebar = () => {
  const { pathname } = window.location;
  const segments = pathname.split('/');
  const lastSegment = segments[segments.length - 1];
  const uuidRegex =
    /^[a-f\d]{8}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{12}$/i;
  const isUuid = uuidRegex.test(lastSegment);
  const [page, setPage] = useState(isUuid ? '' : lastSegment);
  const { images, name } = useProjectInfo();

  const pageInfo = [
    {
      active: page === '',
      badge: undefined,
      children: 'Overview',
      icon: <GridIcon />,
      to: '',
      onClick: () => setPage(''),
    },
    {
      active: page === 'images',
      badge: images.length,
      children: 'Images',
      icon: <ImageIcon />,
      to: 'images',
      onClick: () => setPage('images'),
    },
    {
      active: page === 'annotate',
      badge: undefined,
      children: 'Annotate',
      icon: <MaximizeIcon />,
      to: 'annotate',
      onClick: () => setPage('annotate'),
    },
    {
      active: page === 'train',
      badge: undefined,
      children: 'Train',
      icon: <TrendingUpIcon />,
      to: 'train',
      onClick: () => setPage('train'),
    },
  ];

  return (
    <SidebarContainer>
      <SidebarWrapper>
        <SidebarBrand name={name ? name : ''} />
        <HorizontalLine />
        {pageInfo.map((p, i) => (
          <SidebarLink key={i} active={p.active} to={p.to} onClick={p.onClick}>
            <IconContainer>{p.icon}</IconContainer>
            <Text>{p.children}</Text>
          </SidebarLink>
        ))}
      </SidebarWrapper>
    </SidebarContainer>
  );
};

export default Sidebar;
