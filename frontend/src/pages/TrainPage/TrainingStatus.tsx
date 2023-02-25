import styled from 'styled-components';
import { Card } from '../../components/Card';
import ProgressBar from '../../components/ProgressBar';
import { useTrainingInfo } from '../../context/TrainingInfoContext';
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
  const status = useTrainingInfo();

  const isStopped = status.status === null;
  const isIdle = status.status === 'Idle';
  const color = isStopped ? 'red' : isIdle ? '#169D5A' : '#DA874A';

  return (
    <Card>
      <Form>
        <TitleContainer>
          <Title>Training Status</Title>
        </TitleContainer>
        <Filed>
          <FiledTitle>Status:</FiledTitle>
          <Text style={{ color: color }}>
            {isStopped ? 'Stopped' : status.status}
          </Text>
        </Filed>
        <Filed>
          <FiledTitle>Started:</FiledTitle>
          <Text>{status.duration !== null ? status.duration : '---'}</Text>
        </Filed>
        <Filed>
          <FiledTitle>Progress:</FiledTitle>
          <Text>
            {status.progress !== null ? status.progress + '%' : '---'}
          </Text>
        </Filed>
        <Filed>
          <ProgressBar percentage={status.progress ? status.progress : 0} />
        </Filed>
      </Form>
    </Card>
  );
};

export default TrainingStatus;
