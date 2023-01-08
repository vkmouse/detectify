import React from 'react';
import styled, { DefaultTheme } from 'styled-components';

const SidebarContainer = styled.div`
  width: 260px;
  height: 100vh;
  background: #293042;
  color: white;
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

const SidebarLinkContainer = styled.a<{ active?: boolean }>`
  display: flex;
  justify-content: space-between;
  padding: 0.625rem 1.625rem;
  cursor: pointer;
  ${({ active, theme }) => (active ? activeColor : inactiveColor(theme))}
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
  href?: string;
  onClick?: () => void;
}) => {
  const { active, children, badge, icon, href, onClick } = props;

  return (
    <SidebarLinkContainer active={active} href={href} onClick={onClick}>
      <SidebarLinkAside>
        <SidebarLinkIcon src={icon}></SidebarLinkIcon>
        <span>{children}</span>
      </SidebarLinkAside>
      {badge ? <SidebarLinkBadge>{badge}</SidebarLinkBadge> : <></>}
    </SidebarLinkContainer>
  );
};

const Sidebar = (props: {
  selected: string;
  onSelectedChange: (value: string) => void;
}) => {
  const { selected, onSelectedChange } = props;

  return (
    <SidebarContainer>
      <SidebarBrand />
      <HorizontalLine />
      <SidebarLink
        active={selected === 'overview'}
        badge={12}
        onClick={() => {
          onSelectedChange('overview');
        }}
      >
        Overview
      </SidebarLink>
      <SidebarLink
        active={selected === 'images'}
        onClick={() => {
          onSelectedChange('images');
        }}
      >
        Images
      </SidebarLink>
      <SidebarLink
        active={selected === 'annotate'}
        onClick={() => {
          onSelectedChange('annotate');
        }}
      >
        Annotate
      </SidebarLink>
      <SidebarLink
        active={selected === 'dataset'}
        onClick={() => {
          onSelectedChange('dataset');
        }}
      >
        Dataset
      </SidebarLink>
      <SidebarLink
        active={selected === 'model'}
        onClick={() => {
          onSelectedChange('model');
        }}
      >
        Model
      </SidebarLink>
    </SidebarContainer>
  );
};

export default Sidebar;
