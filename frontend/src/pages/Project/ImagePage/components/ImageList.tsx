import { Grid421 as Grid } from '../../../../components/Grid';
import ImageCard from '../../../../components/ImageCard';
import useProjectImages from '../hooks/useProjectImages';

const ImageList = ({ projectId }: { projectId: string }) => {
  const { images } = useProjectImages(projectId);

  return (
    <Grid>
      {images.map((p, i) => (
        <ImageCard key={i} src={p.imageURL} title={p.filename} />
      ))}
    </Grid>
  );
};

export default ImageList;
