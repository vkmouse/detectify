import styled from 'styled-components';
import { BatchUploadResponse } from '../types/api';
import { Card } from './Card';
import ImageCard from './ImageCard';

const ImageGroup = styled(Card)`
  display: grid;
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
    <ImageGroup style={{ height: height }}>
      {images.map((p, i) => {
        return (
          <ImageCard
            key={i}
            onClick={(e) => onImageCardClick?.(e, p)}
            src={p.imageURL}
            title={p.filename}
          />
        );
      })}
    </ImageGroup>
  );
};

export default ImageCardCollection;
