import styled from 'styled-components';

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

export default ProgressBar;
