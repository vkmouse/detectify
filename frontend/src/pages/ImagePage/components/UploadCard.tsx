import styled from 'styled-components';
import { Card } from '../../../components/Card';
import { Button, ButtonGroup } from '../styles';
import UploadIcon from '../../../assets/upload-cloud.svg';

const CardContainer = styled(Card)`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
  padding: 20px;
  min-height: 260px;
`;

const ImageUploadCard = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  flex-grow: 1;
`;

const UploadSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  flex-grow: 1;
  padding: 20px;
  border: 1px dashed ${(props) => props.theme.colors.bodyColor};
`;

const UploadCard = ({
  disabled,
  onChange,
}: {
  disabled?: boolean;
  onChange?: (files: File[]) => void;
}) => {
  return (
    <CardContainer>
      <ImageUploadCard>
        <UploadSection>
          <UploadIcon width="100" height="100" />
          <p>Upload your images and annotation files</p>
          <ButtonGroup>
            <Button
              multiple
              accept=".jpg,.jpeg,.png,.xml"
              disabled={disabled}
              onUploadChange={onChange}
            >
              Select Files
            </Button>
            <Button
              directory
              accept=".jpg,.jpeg,.png,.xml"
              disabled={disabled}
              onUploadChange={onChange}
            >
              Select Folder
            </Button>
          </ButtonGroup>
        </UploadSection>
      </ImageUploadCard>
    </CardContainer>
  );
};

export default UploadCard;
