import { useRef, useState } from 'react';
import { Grid421 as Grid } from '../../../components/Grid';
import ImageCard from '../../../components/ImageCard';
import Modal, { ModalImage } from '../../../components/Modal';
import { useProjectInfo } from '../../../context/ProjectInfoContext';

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
