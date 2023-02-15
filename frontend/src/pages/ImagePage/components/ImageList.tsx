import { useRef, useState } from 'react';
import { Grid421 as Grid } from '../../../components/Grid';
import ImageCard from '../../../components/ImageCard';
import ImageModal from '../../../components/ImageModal';
import { useProjectInfo } from '../../../context/ProjectInfoContext';

const ImageList = () => {
  const [open, setOpen] = useState(false);
  const srcRef = useRef('');
  const { images } = useProjectInfo();

  return (
    <>
      <ImageModal
        src={srcRef.current}
        open={open}
        onClose={() => setOpen(false)}
      />
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
