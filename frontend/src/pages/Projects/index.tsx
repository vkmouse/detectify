import ProjectCard from './ProjectCard';
import defaultCover from '../../assets/default-cover.png';
import {
  Card,
  CreateProjectContainer,
  CreateProjectIcon,
  CreateProjectWrapper,
  Grid,
} from './styles';
import { useQuery } from '@tanstack/react-query';
import api from '../../api/api';
import { useState } from 'react';
import { ProjectResponse } from '../../types/api';
import CreateProjectDialog from './CreateProjectDialog';

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
          <ProjectCard
            key={i}
            cover={defaultCover}
            dateModified={new Date()}
            name={project.name}
            numCategories={project.categoriesCount}
            numImages={project.imagesCount}
          />
        ))}
      </Grid>
    </>
  );
};

export default ProjectsPage;
