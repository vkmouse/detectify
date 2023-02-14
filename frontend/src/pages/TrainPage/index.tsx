import axios from 'axios';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import api from '../../api/api';
import { PrimaryButton } from '../../components/Button';
import { Card } from '../../components/Card';
import {
  ErrorMessage,
  Input,
  InputContainer,
  InputField,
} from '../../components/InputFiled';

import { useProjectInfo } from '../../context/ProjectInfoContext';
import { useServerInfo } from '../../context/ServerInfoContext';
import { BatchUploadResponse } from '../../types/api';

const ButtonContainer = styled.div`
  display: flex;
  justify-content: end;
  width: 100%;
  padding-top: 5px;
`;

const CardContainer = styled(Card)`
  padding: 20px;
`;

const prepareDataset = (dataset: BatchUploadResponse[]) => {
  return dataset.filter(
    (p) =>
      (p.imageURL.includes('.png') || p.imageURL.includes('.jpg')) &&
      p.annotationURL.includes('.xml')
  );
};

const generateLabelMap = async (dataset: BatchUploadResponse[]) => {
  const labelMap = new Map<string, boolean>();
  const parser = new DOMParser();
  for (const data of dataset) {
    const response = await axios.get(data.annotationURL);
    const xml = response.data;
    const xmlDoc = parser.parseFromString(xml, 'text/xml');
    const objects = xmlDoc.getElementsByTagName('object');
    for (let i = 0; i < objects.length; i++) {
      const label = objects[i].getElementsByTagName('name')[0].textContent;
      if (label) {
        labelMap.set(label, true);
      }
    }
  }
  return labelMap;
};

const prepareLabels = async (dataset: BatchUploadResponse[]) => {
  const labelMap = await generateLabelMap(dataset);
  console.log(labelMap);

  const labels: string[] = [];
  labelMap.forEach((value: boolean, key: string) => {
    labels.push(key);
  });

  return labels;
};

const TrainPage = () => {
  const { id: projectId, images } = useProjectInfo();
  const { serverStatus, defaultServerStatus } = useServerInfo();
  const trainingDisabled = !(
    serverStatus === 'Idle' ||
    (serverStatus === 'Not Created' && defaultServerStatus === 'Idle')
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      batchSize: 8,
      numSteps: 10000,
    },
  });

  const trainModel = async (batchSize: number, numSteps: number) => {
    const dataset = prepareDataset(images);
    const labels = await prepareLabels(dataset);

    if (dataset.length > 0 && labels.length > 0) {
      api.trainModel({
        projectId,
        dataset,
        labels,
        batchSize,
        numSteps,
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit((data) => {
        trainModel(data.batchSize, data.numSteps);
      })}
    >
      <CardContainer>
        <InputField>
          <span>Number of epochs</span>
          <InputContainer>
            <Input
              placeholder="Enter training epochs"
              {...register('numSteps', {
                valueAsNumber: true,
                validate: (value) => 100 <= value && value <= 100000,
              })}
            />
          </InputContainer>
          <ErrorMessage>
            {errors.numSteps ? (
              'The value must be between 100 and 100000.'
            ) : (
              <>&nbsp;</>
            )}
          </ErrorMessage>
        </InputField>
        <InputField>
          <span>Number of batch size</span>
          <InputContainer>
            <Input
              placeholder="Enter batch size"
              {...register('batchSize', {
                valueAsNumber: true,
                validate: (value) => [1, 2, 4, 8, 16].includes(value),
              })}
            />
          </InputContainer>
          {errors.numSteps ? (
            'The value must be one of the following: 1, 2, 4, 8, 16.'
          ) : (
            <>&nbsp;</>
          )}
        </InputField>
      </CardContainer>
      <ButtonContainer>
        <PrimaryButton disabled={trainingDisabled} type="submit">
          Start Training
        </PrimaryButton>
      </ButtonContainer>
    </form>
  );
};

export default TrainPage;
