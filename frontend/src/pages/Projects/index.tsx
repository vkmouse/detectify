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

const ProjectsPage = () => {
  const [projects, setProjects] = useState<ProjectResponse[]>([]);
  useQuery({
    queryKey: ['getProjects'],
    queryFn: api.getProjects,
    onSuccess: (data) => {
      setProjects(data);
    },
  });

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
  );
};

export default ProjectsPage;
