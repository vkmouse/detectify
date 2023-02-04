import { Grid421 as Grid } from '../../../../components/Grid';
import ImageCard from '../../../../components/ImageCard';
import { useProjectInfo } from '../../../../context/ProjectInfoContext';

const ImageList = () => {
  const { images } = useProjectInfo();

  return (
    <Grid>
      {images.map((p, i) => (
        <ImageCard key={i} src={p.imageURL} title={p.filename} />
      ))}
    </Grid>
  );
};

export default ImageList;
