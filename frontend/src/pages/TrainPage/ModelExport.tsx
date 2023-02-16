import styled from 'styled-components';
import { PrimaryButton } from '../../components/Button';
import { Card } from '../../components/Card';
import { Form, Title } from './components/styles';

const Filed = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 0;
`;

const FiledTitle = styled.div`
  width: 250px;
`;

const TextMuted = styled.span`
  color: ${(props) => props.theme.colors.gray500};
  font-size: 90%;
`;

const ModelExport = () => {
  return (
    <Card>
      <Form>
        <Title>Model Export</Title>
        <Filed>
          <div>
            <FiledTitle>Export Tensorflow Model</FiledTitle>
            <TextMuted>
              TensorFlow is an open-source machine learning platform with
              flexibility and distributed computing capabilities, making it
              well-suited for large-scale projects.
            </TextMuted>
          </div>
          <PrimaryButton>Export</PrimaryButton>
        </Filed>
        <Filed>
          <div>
            <FiledTitle>Export IR Model</FiledTitle>
            <TextMuted>
              The Intermediate Representation (IR) model is a format used by the
              OpenVINO toolkit to optimize machine learning models for
              deployment on Intel hardware. It provides a way to represent
              trained models in a hardware-independent format, making it easier
              to deploy models across a variety of devices and systems.
            </TextMuted>
          </div>
          <PrimaryButton>Export</PrimaryButton>
        </Filed>
      </Form>
    </Card>
  );
};

export default ModelExport;
