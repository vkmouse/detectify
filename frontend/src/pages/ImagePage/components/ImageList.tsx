import { useRef, useState } from 'react';
import styled from 'styled-components';
import ImageCard from '../../../components/ImageCard';
import Modal, { ModalImage } from '../../../components/Modal';
import { useProjectInfo } from '../../../context/ProjectInfoContext';
import DeleteIcon from '../../../assets/trash-2.svg';
import { DangerButton } from '../../../components/Button';

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

const CardContainer = styled.div`
  position: relative;
  width: 100%;
  padding-top: 66.67%;
`;

const CardWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const DeleteButton = styled(DangerButton)`
  position: absolute;
  top: 0;
  right: 0;
  padding: 4px 2px;
  margin: 0;
  z-index: 1;
`;

const ImageList = () => {
  const [open, setOpen] = useState(false);
  const srcRef = useRef('');
  const { images, removeProjectImage } = useProjectInfo();

  return (
    <>
      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalImage src={srcRef.current} />
      </Modal>
      <Grid>
        {images.map((p, i) => (
          <CardContainer key={i}>
            <CardWrapper>
              <ImageCard
                src={p.imageURL}
                title={p.filename}
                onClick={() => {
                  srcRef.current = p.imageURL;
                  setOpen(true);
                }}
              />
            </CardWrapper>
            <DeleteButton onClick={() => removeProjectImage(p.filename)}>
              <DeleteIcon />
            </DeleteButton>
          </CardContainer>
        ))}
      </Grid>
    </>
  );
};

export default ImageList;
