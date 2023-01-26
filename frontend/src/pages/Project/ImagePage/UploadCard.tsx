import styled from 'styled-components';
import { Card } from '../../../components/Card';
import { ButtonGroup } from './styles';
import UploadButton from './UploadButton';
import UploadIcon from '../../../assets/upload-cloud.svg';

const CardContainer = styled(Card)`
  display: flex;
  flex-direction: column;
  border-radius: 10px;
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
  margin: 20px;
  flex-grow: 1;
  border: 1px dashed ${(props) => props.theme.colors.bodyColor};
  border-radius: 10px;
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
            <UploadButton
              multiple
              accept=".jpg,.jpeg,.png,.xml"
              disabled={disabled}
              onChange={onChange}
            >
              Select Files
            </UploadButton>
            <UploadButton
              directory
              accept=".jpg,.jpeg,.png,.xml"
              disabled={disabled}
              onChange={onChange}
            >
              Select Folder
            </UploadButton>
          </ButtonGroup>
        </UploadSection>
      </ImageUploadCard>
    </CardContainer>
  );
};

export default UploadCard;
