import ProjectCard from './ProjectCard';
import defaultCover from '../../assets/default-cover.png';
import {
  Card,
  CreateProjectWrapper,
  CreateProjectIcon,
  Grid,
  CreateProjectContainer,
} from './styles';

const ProjectsPage = () => {
  return (
    <Grid>
      <Card>
        <CreateProjectContainer>
          <CreateProjectWrapper>
            <CreateProjectIcon />
            <span>Create New Project</span>
          </CreateProjectWrapper>
        </CreateProjectContainer>
      </Card>
      {[0, 10, 20, 30, 40, 50].map((p, i) => (
        <ProjectCard
          key={i}
          cover={defaultCover}
          dateModified={new Date()}
          name="name"
          numCategories={i}
          numImages={p}
        />
      ))}
    </Grid>
  );
};

export default ProjectsPage;
