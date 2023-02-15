import styled from 'styled-components';
import { DangerButton, PrimaryButton } from '../../components/Button';
import { Card } from '../ProjectsPage/styles';
import CopyIcon from '../../assets/copy.svg';
import DeleteIcon from '../../assets/trash-2.svg';
import ReloadIcon from '../../assets/rotate-cw.svg';
import { useState } from 'react';

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

const TooltipText = styled.div`
  visibility: hidden;
  position: absolute;
  bottom: 110%;
  right: -125%;
  z-index: 1;
  width: 170px;
  background-color: #555;
  color: #fff;
  border-radius: 6px;
  padding: 5px;
  opacity: 0;
  transition: opacity 0.3s;
`;

const Tooltip = styled(PrimaryButton)`
  position: relative;
  &:hover ${TooltipText} {
    visibility: visible;
    opacity: 1;
  }
`;

const copyMsgClick = 'Click to copy token';
const copyMsgSuccess = 'Copied to clipboard!';

const ServerCard = ({
  name,
  status,
  removeDisabled,
  token,
  onCopyClick,
  onRemoveClick,
  onReloadClick,
}: {
  name: string;
  status: string;
  removeDisabled?: boolean;
  token?: string;
  onCopyClick?: () => void;
  onRemoveClick?: () => void;
  onReloadClick?: () => void;
}) => {
  const [tooltip, setTooltip] = useState(copyMsgClick);

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
      <Tooltip
        style={{ visibility: onCopyClick ? 'visible' : 'hidden' }}
        onClick={() => {
          if (token) {
            setTooltip(copyMsgSuccess);
            navigator.clipboard.writeText(token);
          }
        }}
        onMouseLeave={() => {
          setTooltip(copyMsgClick);
        }}
      >
        <TooltipText>{tooltip}</TooltipText>
        <CopyIcon />
      </Tooltip>
      <PrimaryButton onClick={onReloadClick}>
        <ReloadIcon />
      </PrimaryButton>
      <DangerButton disabled={removeDisabled} onClick={onRemoveClick}>
        <DeleteIcon />
      </DangerButton>
    </Container>
  );
};

export default ServerCard;
