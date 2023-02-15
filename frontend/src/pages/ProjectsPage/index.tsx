import defaultCover from '../../assets/default-cover.png';
import {
  Card,
  CreateProjectContainer,
  CreateProjectIcon,
  CreateProjectWrapper,
  InfoWrapper,
} from './styles';
import { useQuery } from '@tanstack/react-query';
import api from '../../api/api';
import { useState } from 'react';
import { ProjectResponse } from '../../types/api';
import CreateProjectDialog from './CreateProjectDialog';
import { Link } from 'react-router-dom';
import { Grid421 as Grid } from '../../components/Grid';
import ImageCard from '../../components/ImageCard';

const ProjectsPage = () => {
  const [projects, setProjects] = useState<ProjectResponse[]>([]);
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useQuery({
    queryKey: ['projects'],
    queryFn: api.getProjects,
    onSuccess: (data) => {
      setProjects(data);
    },
  });

  return (
    <>
      <CreateProjectDialog open={open} onClose={handleClose} />
      <Grid>
        <Card onClick={handleClickOpen}>
          <CreateProjectContainer>
            <CreateProjectWrapper>
              <CreateProjectIcon />
              <span>Create New Project</span>
            </CreateProjectWrapper>
          </CreateProjectContainer>
        </Card>
        {projects.map((project, i) => (
          <Link to={`/project/${project.id}`} key={i}>
            <ImageCard src={defaultCover} title={project.name}>
              <InfoWrapper>
                <span>images: {project.imagesCount}</span>
              </InfoWrapper>
            </ImageCard>
          </Link>
        ))}
      </Grid>
    </>
  );
};

export default ProjectsPage;
