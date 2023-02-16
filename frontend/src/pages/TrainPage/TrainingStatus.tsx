import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import styled from 'styled-components';
import api from '../../api/api';
import { Card } from '../../components/Card';
import ProgressBar from '../../components/ProgressBar';
import { TrainingStatusResponse } from '../../types/api';
import { Form, Title } from './components/styles';

const Text = styled.span`
  background: ${(props) => props.theme.colors.gray200};
  color: ${(props) => props.theme.colors.gray700};
  padding: 2px 7px;
  font-size: 14px;
`;

const TitleContainer = styled.div`
  padding-bottom: 12px;
`;

const Filed = styled.div`
  display: flex;
  align-items: center;
  padding: 6px 0;
`;

const FiledTitle = styled.div`
  width: 80px;
`;

const TrainingStatus = () => {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<TrainingStatusResponse>({
    status: null,
    duration: null,
    progress: null,
  });

  useQuery({
    queryKey: ['trainingStatus'],
    queryFn: async () => {
      return await api.getTrainingStatus();
    },
    onSuccess: (data) => {
      setStatus(data);
      setTimeout(() => queryClient.invalidateQueries(['trainingStatus']), 3000);
    },
  });

  return (
    <Card>
      <Form>
        <TitleContainer>
          <Title>Training Status</Title>
        </TitleContainer>
        <Filed>
          <FiledTitle>Status:</FiledTitle>
          <Text>{status.status}</Text>
        </Filed>
        <Filed>
          <FiledTitle>Started:</FiledTitle>
          <Text>{status.duration}</Text>
        </Filed>
        <Filed>
          <FiledTitle>Progress:</FiledTitle>
          <Text>{status.progress}%</Text>
        </Filed>
        <Filed>
          <ProgressBar percentage={status.progress ? status.progress : 0} />
        </Filed>
      </Form>
    </Card>
  );
};

export default TrainingStatus;
