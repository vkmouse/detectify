import styled from 'styled-components';
import { CardPrimary } from '../../../../components/Card';
import XCircle from '../../../../assets/x-circle.svg';
import ImageIcon from '../../../../assets/image.svg';
import MaximizeIcon from '../../../../assets/maximize.svg';

const ProgressRowInnerWrapper = styled.div`
  display: flex;
`;

const ProgressRowWrapper = styled(CardPrimary)`
  position: relative;
  padding: 5px;
  margin: 0 0 10px 0;
`;

const ProgressRowIconWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const ProgressIconContainer = styled.div`
  margin-right: 10px;
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

const DeleteButton = styled(XCircle)`
  position: absolute;
  top: 0;
  right: 0;
  margin: 5px;
  background-color: inherit;
  border: 0px;
  cursor: pointer;
`;

const ProgressBar = (props: { percentage: number }) => {
  const { percentage } = props;
  return (
    <ProgressContainer>
      <ProgressIndicator style={{ width: `${percentage}%` }} />
    </ProgressContainer>
  );
};

const ProgressRow = ({
  filename,
  percentage,
  onDeleteClick,
}: {
  filename: string;
  percentage: number;
  onDeleteClick?: () => void;
}) => {
  const isCompleted = percentage === 100;

  return (
    <ProgressRowWrapper>
      <DeleteButton onClick={onDeleteClick} />
      <ProgressRowInnerWrapper>
        <ProgressRowIconWrapper>
          <ProgressIconContainer>
            {filename.includes('.xml') ? (
              <MaximizeIcon
                width="36px"
                height="36px"
                transform="translate(6, 12) scale(1.5)"
              />
            ) : (
              <ImageIcon
                width="36px"
                height="36px"
                transform="translate(6, 12) scale(1.5)"
              />
            )}
          </ProgressIconContainer>
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
