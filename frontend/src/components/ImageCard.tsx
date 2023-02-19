import { ReactNode, useRef } from 'react';
import styled from 'styled-components';
import { Card } from './Card';

const borderRadius = 10;

const Container = styled(Card)`
  cursor: pointer;
  font-size: 90%;
  border-radius: ${borderRadius}px;
`;

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  padding-top: 66.67%;
`;

const Image = styled.img`
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  border-radius: ${borderRadius}px ${borderRadius}px 0 0;
`;

const ImageOverlay = styled.div`
  display: none;
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  background: black;
  color: white;
  box-shadow: 0 0 20px black;
  opacity: 20%;
  border-radius: ${borderRadius}px ${borderRadius}px 0 0;
  ${Container}:hover & {
    display: block;
  }
  z-index: 1;
`;

const Overlay = styled.div`
  display: none;
  position: absolute;
  top: 0;
  width: 100%;
  background: black;
  color: white;
  box-shadow: 0 0 20px black;
  opacity: 50%;
  border-radius: ${borderRadius}px ${borderRadius}px 0 0;
  z-index: 2;
  ${Container}:hover & {
    display: block;
  }
`;

const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 5px 10px;
  border-radius: 0 0 ${borderRadius}px ${borderRadius}px;
  max-width: 150px;
`;

const Title = styled.span`
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ImageCard = ({
  src,
  title,
  children,
  onClick,
}: {
  src: string;
  title: string;
  children?: ReactNode;
  onClick?: (element: HTMLImageElement) => void;
}) => {
  const imgRef = useRef<HTMLImageElement>(null);
  return (
    <Container
      onClick={() => {
        if (onClick && imgRef.current) {
          onClick(imgRef.current);
        }
      }}
    >
      <Wrapper>
        <ImageOverlay />
        <Image ref={imgRef} src={src} />
        <Overlay>{children}</Overlay>
      </Wrapper>
      <TitleContainer>
        <Title>{title}</Title>
      </TitleContainer>
    </Container>
  );
};

export default ImageCard;
