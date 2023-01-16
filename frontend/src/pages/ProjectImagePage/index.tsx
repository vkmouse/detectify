import UploadButton from './UploadButton';
import ProgressRow from './ProgressRow';
import {
  ImageUploadContainer as UploadContainer,
  Grid as UploadLayout,
  FlexColumn as UploadColumn,
  FilePicker,
  ButtonGroup,
  ProgressContainer,
  ProgressWrapper,
  Button,
} from './styles';

const ProjectImagePage = () => {
  return (
    <>
      <span>Image</span>
      <hr />
      <UploadContainer>
        <UploadLayout>
          <UploadColumn>
            <FilePicker />
            <ButtonGroup>
              <UploadButton multiple accept=".jpg,.jpeg,.png,.xml">
                Select File
              </UploadButton>
              <UploadButton directory accept=".jpg,.jpeg,.png,.xml">
                Select Folder
              </UploadButton>
            </ButtonGroup>
          </UploadColumn>
          <ProgressContainer>
            <ProgressWrapper>
              {[10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((p, i) => {
                return (
                  <ProgressRow
                    key={i}
                    filename={'image-30.png'}
                    percentage={p}
                  />
                );
              })}
            </ProgressWrapper>
            <ButtonGroup>
              <Button>Upload</Button>
            </ButtonGroup>
          </ProgressContainer>
        </UploadLayout>
      </UploadContainer>
    </>
  );
};

export default ProjectImagePage;
