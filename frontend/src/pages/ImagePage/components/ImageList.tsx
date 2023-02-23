import { useRef, useState } from 'react';
import styled from 'styled-components';
import ImageCard from '../../../components/ImageCard';
import Modal, { ModalImage } from '../../../components/Modal';
import { useProjectInfo } from '../../../context/ProjectInfoContext';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 25%);
  grid-column-gap: 10px;
  grid-row-gap: 10px;
  margin-right: 30px;
  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 50%);
    margin-right: 10px;
  }
  @media (max-width: 600px) {
    grid-template-columns: repeat(1, 100%);
    margin-right: 0;
  }
`;

const ImageList = () => {
  const [open, setOpen] = useState(false);
  const srcRef = useRef('');
  const { images } = useProjectInfo();

  return (
    <>
      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalImage src={srcRef.current} />
      </Modal>
      <Grid>
        {images.map((p, i) => (
          <ImageCard
            key={i}
            src={p.imageURL}
            title={p.filename}
            onClick={() => {
              srcRef.current = p.imageURL;
              setOpen(true);
            }}
          />
        ))}
      </Grid>
    </>
  );
};

export default ImageList;
