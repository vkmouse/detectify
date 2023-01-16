import styled from 'styled-components';
import PrimaryButton from '../../components/UIElements/Button';
import Card from '../../components/UIElements/Card';

const ProjectTitle = styled.div``;

const ImageUploadContainer = styled.div`
  width: 100%;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: 500px;
`;

const UploadContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const FilePicker = styled.div`
  flex-grow: 1;
  background: gray;
  margin: 0 10px;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 5px;
`;

const Button = styled(PrimaryButton)`
  width: 120px;
  margin: 3px 10px;
`;

const FlexContainer = styled.div`
  display: flex;
`;

const ProgressContainer = styled.div`
  overflow: auto;
  max-width: 400px;
  padding: 0 10px;
`;

const ProgressWrapper = styled.div``;

const ProgressRowContainer = styled(Card)`
  padding: 1.25rem;
  margin: 0 0 10px 0;
`;

const ProgressBarContainer = styled.div`
  margin: 5px 0;
  flex-grow: 1;
  height: 8px;
  background: ${(props) => props.theme.colors.progressBackground};
  border-radius: 5px;
`;

const ProgressBarWrapper = styled.div`
  height: 8px;
  background: ${(props) => props.theme.colors.progressBackgroundPrimary};
  border-radius: 5px;
`;

const UploadFilename = styled.div``;

const ProgressRowIconContainer = styled.div`
  display: flex;
  align-items: center;
`;

const ProgressRowIcon = styled.img`
  margin-right: 10px;
  width: 48px;
  height: 48px;
  background: ${(props) => props.theme.colors.primary};
`;
const ProgressDetail = styled.div``;
const UploadProgressContainer = styled.div`
  flex-grow: 1;
`;

const ProgressBar = (props: { percentage: number }) => {
  const { percentage } = props;
  return (
    <ProgressBarContainer>
      <ProgressBarWrapper style={{ width: `${percentage}%` }} />
    </ProgressBarContainer>
  );
};

const ProgressRow = (props: { filename: string; percentage: number }) => {
  const { filename, percentage } = props;
  const isCompleted = percentage === 100;

  return (
    <ProgressRowContainer>
      <FlexContainer>
        <ProgressRowIconContainer>
          <ProgressRowIcon />
        </ProgressRowIconContainer>
        <UploadProgressContainer>
          <UploadFilename>
            {filename} - {isCompleted ? 'Uploaded' : 'Uploading'}
          </UploadFilename>
          <ProgressBar percentage={percentage} />
          <ProgressDetail>
            {isCompleted ? 'Completed' : `${percentage}%`}
          </ProgressDetail>
        </UploadProgressContainer>
      </FlexContainer>
    </ProgressRowContainer>
  );
};

const ProjectImagePage = () => {
  return (
    <>
      <ProjectTitle>Image</ProjectTitle>
      <hr />
      <ImageUploadContainer>
        <Grid>
          <UploadContainer>
            <FilePicker></FilePicker>
            <ButtonGroup>
              <Button>Select File</Button>
              <Button>Select Folder</Button>
            </ButtonGroup>
          </UploadContainer>
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
          </ProgressContainer>
        </Grid>
      </ImageUploadContainer>
    </>
  );
};

export default ProjectImagePage;
