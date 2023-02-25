import { Link } from 'react-router-dom';
import styled from 'styled-components';
import AnnotatePage from '../../assets/AnnotatePage.png';
import ImagePage from '../../assets/ImagePage.png';
import TrainPage from '../../assets/TrainPage.png';

const Bold = styled.span`
  font-weight: bold;
`;

const CustomLink = styled(Link)`
  text-decoration: underline;
`;

const ImagePageInfo = {
  name: 'Upload Image',
  img: ImagePage,
  title: 'Upload Image',
  description: (
    <>
      <Bold>Select File</Bold> or <Bold>Select Folder</Bold>, then click
      <Bold> Upload</Bold> to upload images for the AI model. Please wait for
      the upload to finish.
      <br />
      <br />
      <CustomLink to="images">Go to image page</CustomLink>
    </>
  ),
};

const AnnotatePageInfo = {
  name: 'Prepare dataset',
  img: AnnotatePage,
  title: 'Prepare dataset',
  description: (
    <>
      Label images by drawing rectangles and assigning a name to each category.
      <br />
      <br />
      <br />
      <CustomLink to="annotate">Go to annotate page</CustomLink>
    </>
  ),
};

const TrainPageInfo = {
  name: 'Start training',
  img: TrainPage,
  title: 'Start training',
  description: (
    <>
      To start the AI model training process, click on the
      <Bold> Start Training </Bold>
      button. If the button is disabled, please check the server page before
      proceeding.
      <br />
      <br />
      <CustomLink to="train">Go to train page</CustomLink>
    </>
  ),
};

const TutorialInfo = {
  title: 'How to train your images',
  description: (
    <>
      Training your own images can help models better understand your specific
      problem or use case.
    </>
  ),
  cards: [ImagePageInfo, AnnotatePageInfo, TrainPageInfo],
};

export default TutorialInfo;
