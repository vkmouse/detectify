import styled from 'styled-components';
import { PrimaryButton } from '../../../components/Button';
import { Card } from '../../../components/Card';
import { ProgressContainer, ProgressWrapper, ButtonGroup } from '../styles';
import ProgressRow from './ProgressRow';

const CardContainer = styled(Card)`
  display: flex;
  flex-direction: column;
  padding: 20px;
  margin-bottom: 10px;
  height: 260px;
`;

const ProgressCard = ({
  queue,
  disabled,
  onUpload,
  onDelete,
}: {
  queue: {
    file: File;
    progress: number;
  }[];
  disabled?: boolean;
  onUpload?: () => void;
  onDelete?: (filename: string) => void;
}) => {
  return (
    <CardContainer>
      <ProgressContainer>
        <ProgressWrapper>
          {queue.map((item, i) => {
            return (
              <ProgressRow
                key={i}
                filename={item.file.name}
                percentage={item.progress}
                onDeleteClick={() => onDelete?.(item.file.name)}
              />
            );
          })}
        </ProgressWrapper>
      </ProgressContainer>
      <ButtonGroup>
        <PrimaryButton disabled={disabled} onClick={onUpload}>
          Upload
        </PrimaryButton>
      </ButtonGroup>
    </CardContainer>
  );
};

export default ProgressCard;
