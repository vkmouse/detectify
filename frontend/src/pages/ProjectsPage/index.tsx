import defaultCover from '../../assets/default-cover.png';
import {
  CreateProjectContainer,
  CreateProjectIcon,
  CreateProjectWrapper,
  InfoWrapper,
} from './styles';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../api/api';
import { useState } from 'react';
import { ProjectResponse } from '../../types/api';
import CreateProjectDialog from './CreateProjectDialog';
import { Link } from 'react-router-dom';
import { Grid421 as Grid } from '../../components/Grid';
import ImageCard from '../../components/ImageCard';
import { Card } from '../../components/Card';
import styled from 'styled-components';
import DeleteIcon from '../../assets/trash-2.svg';
import { DangerButton } from '../../components/Button';
import { LoadingModal } from '../../components/Loading';

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
  z-index: 2;
`;

const ProjectsPage = () => {
  const [projects, setProjects] = useState<ProjectResponse[]>([]);
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const { isFetching } = useQuery({
    queryKey: ['projects'],
    queryFn: api.getProjects,
    onSuccess: (data) => {
      setProjects(data);
    },
  });

  const { isLoading, mutate } = useMutation<boolean, Error, string>({
    mutationFn: api.removeProject,
    onSuccess: () => queryClient.invalidateQueries(['projects']),
  });

  return (
    <>
      <CreateProjectDialog open={open} onClose={handleClose} />
      <LoadingModal isLoading={isFetching || isLoading} />
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
          <CardContainer key={i}>
            <Link to={`/project/${project.id}`} key={i}>
              <CardWrapper>
                <ImageCard src={defaultCover} title={project.name}>
                  <InfoWrapper>
                    <span>images: {project.imagesCount}</span>
                  </InfoWrapper>
                </ImageCard>
              </CardWrapper>
            </Link>
            <DeleteButton
              disabled={project.name === 'Wally'}
              onClick={() => mutate(project.id)}
            >
              <DeleteIcon />
            </DeleteButton>
          </CardContainer>
        ))}
      </Grid>
    </>
  );
};

export default ProjectsPage;
