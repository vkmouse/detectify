import styled from 'styled-components';
import useProjectImages from '../hooks/useProjectImages';

const ImageListLayout = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
`;

const ImageList = ({ projectId }: { projectId: string }) => {
  const { images } = useProjectImages(projectId);

  return (
    <ImageListLayout>
      {images.map((p, i) => (
        <Image src={p} key={i} />
      ))}
    </ImageListLayout>
  );
};

export default ImageList;
