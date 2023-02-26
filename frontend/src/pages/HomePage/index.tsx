import styled from 'styled-components';
import { navbarHeight } from '../../components/Layout';
import Banner from './Banner';
import Section from './Section';
import AnnotatePageImage from '../../assets/AnnotatePage.png';
import ExportModelImage from '../../assets/ExportModel.png';
import TrainPageImage from '../../assets/TrainPage.png';
import TryModelImage from '../../assets/TryModel.png';

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: calc(100vw - 8px);
  height: 630px;
  padding-top: ${navbarHeight}px;
  background: #293042;
`;

const SectionContainer = styled.div`
  padding-top: 630px;
`;

const HomePage = () => {
  return (
    <>
      <Container>
        <Banner />
      </Container>
      <SectionContainer>
        <Section
          img={TryModelImage}
          title="Try Object Detection Service"
          description="Easily experiment with object detection using an available service and customize it as needed"
          imageLeft
        />
        <Section
          img={AnnotatePageImage}
          title="Provide Image Annotation"
          description="Get annotation and object detection in a single platform for a seamless user experience"
        />
        <Section
          img={TrainPageImage}
          title="Colab Resource Integration"
          description="Integrate colab resources for model training and streamline object detection service development"
          imageLeft
        />
        <Section
          img={ExportModelImage}
          title="Export Tensorflow and OpenVINO models"
          description="Access Tensorflow and OpenVINO models for exporting to boost object detection capabilities"
        />
      </SectionContainer>
    </>
  );
};

export default HomePage;
