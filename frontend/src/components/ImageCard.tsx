import { ReactNode, useRef } from 'react';
import styled from 'styled-components';
import { Card } from './Card';

const borderRadius = 10;

const ImageCardContainer = styled(Card)`
  cursor: pointer;
  font-size: 90%;
  border-radius: ${borderRadius}px;
`;

const ImageWrapper = styled.div`
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
  ${ImageCardContainer}:hover & {
    display: block;
  }
`;

const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 5px 10px;
  border-radius: 0 0 ${borderRadius}px ${borderRadius}px;
`;

const Title = styled.span`
  font-weight: bold;
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
    <ImageCardContainer
      onClick={() => {
        if (onClick && imgRef.current) {
          onClick(imgRef.current);
        }
      }}
    >
      <ImageWrapper>
        <Image ref={imgRef} src={src} />
        <Overlay>{children}</Overlay>
      </ImageWrapper>
      <TitleContainer>
        <Title>{title}</Title>
      </TitleContainer>
    </ImageCardContainer>
  );
};

export default ImageCard;
