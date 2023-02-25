import styled from 'styled-components';
import { CardPrimary } from '../../../components/Card';
import XCircle from '../../../assets/x-circle.svg';
import ImageIcon from '../../../assets/image.svg';
import MaximizeIcon from '../../../assets/maximize.svg';
import ProgressBar from '../../../components/ProgressBar';

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
  overflow-x: hidden;
  word-wrap: break-word;
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
