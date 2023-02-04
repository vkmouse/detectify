import React from 'react';
import styled from 'styled-components';

const LoaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 100px;
  height: 100px;
`;

const DualRing = styled.div`
  display: inline-block;
  position: absolute;
  width: 80px;
  height: 80px;
  margin-right: 12px;
  margin-bottom: 12px;
  &:after {
    content: ' ';
    display: block;
    width: 64px;
    height: 64px;
    margin: 8px;
    border-radius: 50%;
    border: 6px solid ${(props) => props.theme.colors.primary};
    border-color: ${(props) => props.theme.colors.primary} transparent
      ${(props) => props.theme.colors.primary} transparent;
    animation: lds-dual-ring 1.2s linear infinite;
  }
  @keyframes lds-dual-ring {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const LoadingBackground = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  background-color: black;
  opacity: 0.5;
`;

const LoadingOverlay = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
`;

const Loader = () => {
  return (
    <LoaderContainer>
      <DualRing />
    </LoaderContainer>
  );
};

const Loading = () => {
  return (
    <>
      <LoadingBackground />
      <LoadingOverlay>
        <LoaderContainer>
          <DualRing />
        </LoaderContainer>
      </LoadingOverlay>
    </>
  );
};

export { Loader, Loading };
