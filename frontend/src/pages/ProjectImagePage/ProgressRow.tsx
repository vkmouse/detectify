import styled from 'styled-components';
import Card from '../../components/UIElements/Card';

const ProgressRowInnerWrapper = styled.div`
  display: flex;
`;

const ProgressRowWrapper = styled(Card)`
  padding: 1.25rem;
  margin: 0 0 10px 0;
`;

const ProgressRowIconWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const ProgressIcon = styled.img`
  margin-right: 10px;
  width: 48px;
  height: 48px;
  background: ${(props) => props.theme.colors.primary};
`;

const ProgressDetailsContainer = styled.div`
  flex-grow: 1;
`;

const ProgressContainer = styled.div`
  margin: 5px 0;
  flex-grow: 1;
  height: 8px;
  background: ${(props) => props.theme.colors.progressBackground};
  border-radius: 5px;
`;

const ProgressIndicator = styled.div`
  height: 8px;
  background: ${(props) => props.theme.colors.progressBackgroundPrimary};
  border-radius: 5px;
`;

const ProgressBar = (props: { percentage: number }) => {
  const { percentage } = props;
  return (
    <ProgressContainer>
      <ProgressIndicator style={{ width: `${percentage}%` }} />
    </ProgressContainer>
  );
};

const ProgressRow = (props: { filename: string; percentage: number }) => {
  const { filename, percentage } = props;
  const isCompleted = percentage === 100;

  return (
    <ProgressRowWrapper>
      <ProgressRowInnerWrapper>
        <ProgressRowIconWrapper>
          <ProgressIcon />
        </ProgressRowIconWrapper>
        <ProgressDetailsContainer>
          {filename}
          <ProgressBar percentage={percentage} />
          {isCompleted ? 'Completed' : `${percentage}%`}
        </ProgressDetailsContainer>
      </ProgressRowInnerWrapper>
    </ProgressRowWrapper>
  );
};

export default ProgressRow;
