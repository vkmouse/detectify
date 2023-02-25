import styled from 'styled-components';
import { BatchUploadResponse } from '../types/api';
import { Card } from './Card';
import ImageCard from './ImageCard';

const Container = styled.div`
  position: relative;
  width: 100%;
  @media (max-width: 600px) {
    height: 300px;
  }
`;

const Wrapper = styled(Card)`
  display: grid;
  grid-template-columns: 100%;
  row-gap: 5px;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  overflow-x: hidden;
`;

const ImageCardCollection = ({
  images,
  height,
  onImageCardClick,
}: {
  images: BatchUploadResponse[];
  height?: string;
  onImageCardClick?: (
    element: HTMLImageElement,
    info: BatchUploadResponse
  ) => void;
}) => {
  return (
    <Container>
      <Wrapper style={{ height: height }}>
        {images.map((p, i) => (
          <ImageCard
            key={i}
            onClick={(e) => onImageCardClick?.(e, p)}
            src={p.imageURL}
            title={p.filename}
          />
        ))}
      </Wrapper>
    </Container>
  );
};

export default ImageCardCollection;
