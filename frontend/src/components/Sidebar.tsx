import React, { useState } from 'react';
import { Link, LinkProps as RouterLinkProps } from 'react-router-dom';
import styled, { DefaultTheme } from 'styled-components';
import TrendingUpIcon from '../assets/trending-up.svg';
import GridIcon from '../assets/grid.svg';
import ImageIcon from '../assets/image.svg';
import MaximizeIcon from '../assets/maximize.svg';
import { useProjectInfo } from '../context/ProjectInfoContext';
import { navbarHeight, sidebarWidth } from './Layout';

const SidebarContainer = styled.div`
  position: fixed;
  width: ${() => `${sidebarWidth}px`};
  height: 100vh;
  margin-top: ${() => `${navbarHeight}px`};
  background-color: ${(props) => props.theme.colors.bodyBackground};
  z-index: 999;
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
`;

const SidebarBrandText = styled.span`
  font-size: 1.25rem;
  font-weight: 500;
`;

const HorizontalLine = styled.hr`
  border-color: ${(props) => props.theme.colors.gray500};
  margin: 0;
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
        {badge && <SidebarLinkBadge>{badge}</SidebarLinkBadge>}
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
  const [page, setPage] = useState('');
  const { images, name } = useProjectInfo();

  return (
    <SidebarContainer>
      <SidebarWrapper>
        <SidebarBrand name={name ? name : ''} />
        <HorizontalLine />
        <SidebarLink
          active={page === 'images'}
          to="images"
          badge={images.length}
          onClick={() => setPage('images')}
        >
          <IconContainer>
            <ImageIcon />
          </IconContainer>
          Images
        </SidebarLink>
        <SidebarLink
          active={page === 'annotate'}
          to="annotate"
          onClick={() => setPage('annotate')}
        >
          <IconContainer>
            <MaximizeIcon />
          </IconContainer>
          Annotate
        </SidebarLink>
        <SidebarLink
          active={page === 'train'}
          to="train"
          onClick={() => setPage('train')}
        >
          <IconContainer>
            <GridIcon />
          </IconContainer>
          Train
        </SidebarLink>
        <SidebarLink
          active={page === 'predict'}
          to="predict"
          onClick={() => setPage('predict')}
        >
          <IconContainer>
            <TrendingUpIcon />
          </IconContainer>
          Predict
        </SidebarLink>
      </SidebarWrapper>
    </SidebarContainer>
  );
};

export default Sidebar;
