import { useState } from 'react';
import styled from 'styled-components';
import { OutlinePrimaryButton, PrimaryButton } from '../../components/Button';
import { Card } from '../../components/Card';
import { Input, InputContainer } from '../../components/InputFiled';
import DownIcon from '../../assets/chevron-down.svg';
import UpIcon from '../../assets/chevron-up.svg';
import HelpIcon from '../../assets/help-circle.svg';
import { Form, InputGroup, Title } from './components/styles';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { BatchUploadResponse } from '../../types/api';
import axios from 'axios';
import api from '../../api/api';
import { useProjectInfo } from '../../context/ProjectInfoContext';
import { useServerInfo } from '../../context/ServerInfoContext';
import { useTrainingInfo } from '../../context/TrainingInfoContext';
import { Link } from 'react-router-dom';

const AdvanceToggle = styled(OutlinePrimaryButton)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin: 6px 0 0 0;
`;

const FieldTitle = styled.span`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: calc(100% + 32px);
  padding-bottom: 4px;
`;

const TooltipText = styled.div`
  visibility: hidden;
  position: absolute;
  top: 0px;
  left: 0px;
  width: calc(100% - 40px);
  z-index: 1;
  background-color: #555;
  color: #fff;
  border-radius: 6px;
  padding: 10px 20px;
  opacity: 0;
  transition: opacity 0.3s;
`;

const Tooltip = styled.div`
  &:hover ${TooltipText} {
    visibility: visible;
    opacity: 1;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: end;
  position: relative;
  &:hover ${TooltipText} {
    visibility: visible;
    opacity: 1;
  }
`;

const CustomLink = styled(Link)`
  text-decoration: underline;
`;

const TrainingConfig = () => {
  const { id: projectId, images, exportedModel } = useProjectInfo();
  const {
    reloadIsServerAlive: reloadIsServerAlive,
    reloadIsDefaultServerAlive: reloadIsDefaultServerAlive,
  } = useServerInfo();
  const [advance, setAdvance] = useState(false);
  const { isTraining, reloadServerInfo } = useTrainingInfo();
  const { isDefaultServerAlive, isServerAlive } = useServerInfo();
  const methods = useForm({
    defaultValues: {
      batchSize: 4,
      numSteps: 1000,
      learningRateBase: 0.08,
      warmupLearningRate: 0.026,
      warmupSteps: 100,
    },
  });

  const trainModel = async (props: {
    batchSize: number;
    numSteps: number;
    learningRateBase: number;
    warmupLearningRate: number;
    warmupSteps: number;
  }) => {
    const dataset = prepareDataset(images);
    const labels = await prepareLabels(dataset);

    if (dataset.length > 0 && labels.length > 0) {
      api
        .trainModel({
          ...props,
          projectId,
          dataset,
          labels,
          pretrainedModelURL: exportedModel,
        })
        .then(() => {
          reloadIsServerAlive();
          reloadIsDefaultServerAlive();
          reloadServerInfo();
        });
    }
  };

  const handleSubmit = methods.handleSubmit((data) => {
    trainModel(data);
  });

  const disabled = !(isDefaultServerAlive || isServerAlive) || isTraining;

  return (
    <Card>
      <FormProvider {...methods}>
        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Title>Training Configuration</Title>
            <ButtonContainer>
              <PrimaryButton disabled={disabled}>Start Training</PrimaryButton>
              {disabled && (
                <TooltipText>
                  Before you begin training, make sure to check the status of
                  the server to ensure it is ready.
                  <br />
                  <CustomLink to="/server">Go to server page</CustomLink>.
                </TooltipText>
              )}
            </ButtonContainer>
          </InputGroup>
          <AdvanceToggle
            type="button"
            onClick={() => setAdvance((advance) => !advance)}
          >
            Advance Options {advance ? <UpIcon /> : <DownIcon />}
          </AdvanceToggle>
          {advance && (
            <>
              <InputGroup>
                <PreTrainedModel />
                <BatchSize />
                <Epochs />
                <LearningRateBase />
                <WarmupLearningRate />
                <WarmupSteps />
              </InputGroup>
              <ButtonContainer>
                <OutlinePrimaryButton
                  type="button"
                  onClick={() => methods.reset()}
                >
                  Reset Defaults
                </OutlinePrimaryButton>
              </ButtonContainer>
            </>
          )}
        </Form>
      </FormProvider>
    </Card>
  );
};

function PreTrainedModel() {
  return (
    <InputContainer>
      <FieldTitle>
        Pre-trained model &nbsp;
        <Tooltip>
          <HelpIcon />
          <TooltipText>
            A pre-trained model is a machine learning model trained on other
            dataset, used as a starting point for other tasks, and can save time
            and resources by leveraging the learned features of model.
          </TooltipText>
        </Tooltip>
      </FieldTitle>
      <Input value="ssd320" disabled={true} />
    </InputContainer>
  );
}

function BatchSize() {
  const { register } = useFormContext();
  return (
    <InputContainer>
      <FieldTitle>
        Batch size &nbsp;
        <Tooltip>
          <HelpIcon />
          <TooltipText>
            A batch is a subset of samples used in one training iteration, with
            batch size determining the number of batches. Batch size adjustment
            is usually not required for optimal training results.
          </TooltipText>
        </Tooltip>
      </FieldTitle>
      <Input
        placeholder="Enter batch size"
        {...register('batchSize', {
          valueAsNumber: true,
          validate: (value) => [1, 2, 4, 8, 16].includes(value),
        })}
      />
    </InputContainer>
  );
}

function Epochs() {
  const { register } = useFormContext();
  return (
    <InputContainer>
      <FieldTitle>
        Epochs
        <Tooltip>
          <HelpIcon />
          <TooltipText>
            An epoch is a complete iteration through the training dataset during
            model training, with increasing epochs typically leading to better
            results.
          </TooltipText>
        </Tooltip>
      </FieldTitle>
      <Input
        placeholder="Enter training epochs"
        {...register('numSteps', {
          valueAsNumber: true,
          validate: (value) => 100 <= value && value <= 100000,
        })}
      />
    </InputContainer>
  );
}

function LearningRateBase() {
  const { register } = useFormContext();
  return (
    <InputContainer>
      <FieldTitle>
        Learning Rate Base
        <Tooltip>
          <HelpIcon />
          <TooltipText>
            The learning rate determines the size of the steps of model during
            training. Learning rate base is the maximum learning rate of the
            schedule, and it starts at this value.
          </TooltipText>
        </Tooltip>
      </FieldTitle>
      <Input
        placeholder="Enter learning rate base"
        {...register('learningRateBase', {
          valueAsNumber: true,
          validate: (value) => 0 <= value && value <= 1,
        })}
      />
    </InputContainer>
  );
}

function WarmupLearningRate() {
  const { register } = useFormContext();
  return (
    <InputContainer>
      <FieldTitle>
        Warmup Learning Rate
        <Tooltip>
          <HelpIcon />
          <TooltipText>
            Warmup learning rate is the learning rate at the beginning of the
            schedule, before it starts to increase towards the learning rate
            base value. This is used to gradually increase the learning rate to
            avoid unstable training at the beginning.
          </TooltipText>
        </Tooltip>
      </FieldTitle>
      <Input
        placeholder="Enter warmup learning rate"
        {...register('warmupLearningRate', {
          valueAsNumber: true,
          validate: (value) => 0 <= value && value <= 1,
        })}
      />
    </InputContainer>
  );
}

function WarmupSteps() {
  const { register } = useFormContext();
  return (
    <InputContainer>
      <FieldTitle>
        Warmup Steps
        <Tooltip>
          <HelpIcon />
          <TooltipText>
            Warmup steps is the number of steps (iterations) used for the warmup
            phase, during which the learning rate gradually increases from the
            warmup learning rate to the learning_rate_base value.
          </TooltipText>
        </Tooltip>
      </FieldTitle>
      <Input
        placeholder="Enter warmup steps"
        {...register('warmupSteps', {
          valueAsNumber: true,
          validate: (value) => 0 <= value && value <= 100000,
        })}
      />
    </InputContainer>
  );
}

function prepareDataset(dataset: BatchUploadResponse[]) {
  return dataset.filter(
    (p) =>
      (p.imageURL.includes('.png') || p.imageURL.includes('.jpg')) &&
      p.annotationURL.includes('.xml')
  );
}

async function generateLabelMap(dataset: BatchUploadResponse[]) {
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
}

async function prepareLabels(dataset: BatchUploadResponse[]) {
  const labelMap = await generateLabelMap(dataset);

  const labels: string[] = [];
  labelMap.forEach((value: boolean, key: string) => {
    labels.push(key);
  });

  return labels;
}

export default TrainingConfig;
