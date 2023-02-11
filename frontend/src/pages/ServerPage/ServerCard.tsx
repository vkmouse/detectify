import styled from 'styled-components';
import { PrimaryButton } from '../../components/Button';
import { Card } from '../ProjectsPage/styles';

const Container = styled(Card)`
  display: flex;
  padding: 20px;
  margin-bottom: 20px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-column-gap: 5px;
  flex-grow: 1;
`;

const DetailContainer = styled.div``;

const Title = styled.div`
  color: ${(props) => props.theme.colors.gray700};
  padding-bottom: 5px;
`;

const Detail = styled.div`
  color: ${(props) => props.theme.colors.primary};
  font-weight: bold;
`;

const ServerCard = ({
  name,
  status,
  removeDisabled,
  onRemoveClick,
}: {
  name: string;
  status: string;
  removeDisabled?: boolean;
  onRemoveClick?: () => void;
}) => {
  return (
    <Container>
      <Grid>
        <DetailContainer>
          <Title>Server name</Title>
          <Detail>{name}</Detail>
        </DetailContainer>
        <DetailContainer>
          <Title>Server Status</Title>
          <Detail style={{ color: status === 'Idle' ? '#169D5A' : '#DA874A' }}>
            {status}
          </Detail>
        </DetailContainer>
      </Grid>
      <PrimaryButton
        disabled={removeDisabled}
        style={{ visibility: onRemoveClick ? 'visible' : 'hidden' }}
        onClick={onRemoveClick}
      >
        Remove
      </PrimaryButton>
    </Container>
  );
};

export default ServerCard;
