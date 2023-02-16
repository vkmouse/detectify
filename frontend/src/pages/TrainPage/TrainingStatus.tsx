import styled from 'styled-components';
import { Card } from '../../components/Card';
import ProgressBar from '../../components/ProgressBar';
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
  const status = 'Training';
  const startTime = '3 day age';
  const percentage = 25;
  return (
    <Card>
      <Form>
        <TitleContainer>
          <Title>Training Status</Title>
        </TitleContainer>
        <Filed>
          <FiledTitle>Status:</FiledTitle>
          <Text>{status}</Text>
        </Filed>
        <Filed>
          <FiledTitle>Started:</FiledTitle>
          <Text>{startTime}</Text>
        </Filed>
        <Filed>
          <FiledTitle>Progress:</FiledTitle>
          <Text>{percentage}%</Text>
        </Filed>
        <Filed>
          <ProgressBar percentage={percentage} />
        </Filed>
      </Form>
    </Card>
  );
};

export default TrainingStatus;
