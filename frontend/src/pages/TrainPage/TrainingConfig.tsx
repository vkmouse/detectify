import { useState } from 'react';
import styled from 'styled-components';
import { OutlinePrimaryButton, PrimaryButton } from '../../components/Button';
import { Card } from '../../components/Card';
import { Input, InputContainer } from '../../components/InputFiled';
import DownIcon from '../../assets/chevron-down.svg';
import UpIcon from '../../assets/chevron-up.svg';
import HelpIcon from '../../assets/help-circle.svg';

const Form = styled.form`
  padding: 20px;
`;

const Title = styled.span`
  font-weight: bold;
  font-size: 110%;
`;

const InputGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  column-gap: 12px;
  row-gap: 12px;
  @media (max-width: 960px) {
    grid-template-columns: repeat(1, 1fr);
    grid-column-gap: 0;
    grid-row-gap: 12px;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: end;
`;

const AdvanceToggle = styled(OutlinePrimaryButton)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin: 6px 0;
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

const TrainingConfig = () => {
  const [advance, setAdvance] = useState(true);
  return (
    <Card>
      <Form>
        <InputGroup>
          <Title>Model Training Configuration</Title>
          <ButtonContainer>
            <PrimaryButton>Start Training</PrimaryButton>
          </ButtonContainer>
        </InputGroup>
        <AdvanceToggle
          type="button"
          onClick={() => setAdvance((advance) => !advance)}
        >
          Advance Options {advance ? <DownIcon /> : <UpIcon />}
        </AdvanceToggle>
        {advance && (
          <InputGroup>
            <InputContainer>
              <FieldTitle>
                Pre-trained model &nbsp;
                <Tooltip>
                  <HelpIcon />
                  <TooltipText>
                    A pre-trained model is a machine learning model trained on
                    other dataset, used as a starting point for other tasks, and
                    can save time and resources by leveraging the learned
                    features of model.
                  </TooltipText>
                </Tooltip>
              </FieldTitle>
              <Input value="ssd320" disabled={true} />
            </InputContainer>
            <InputContainer>
              <FieldTitle>
                Batch size &nbsp;
                <Tooltip>
                  <HelpIcon />
                  <TooltipText>
                    A batch is a subset of samples used in one training
                    iteration, with batch size determining the number of
                    batches. Batch size adjustment is usually not required for
                    optimal training results.
                  </TooltipText>
                </Tooltip>
              </FieldTitle>
              <Input placeholder="Enter batch size" />
            </InputContainer>
            <InputContainer>
              <FieldTitle>
                Epochs
                <Tooltip>
                  <HelpIcon />
                  <TooltipText>
                    An epoch is a complete iteration through the training
                    dataset during model training, with increasing epochs
                    typically leading to better results.
                  </TooltipText>
                </Tooltip>
              </FieldTitle>
              <Input placeholder="Enter training epochs" />
            </InputContainer>
            <InputContainer>
              <FieldTitle>
                Learning Rate
                <Tooltip>
                  <HelpIcon />
                  <TooltipText>
                    The learning rate determines the size of the steps of model
                    during training. Tweaking it can significantly affect model
                    performance, so experimentation is recommended to find the
                    optimal value.
                  </TooltipText>
                </Tooltip>
              </FieldTitle>
              <Input placeholder="Enter learning rate" />
            </InputContainer>
          </InputGroup>
        )}
      </Form>
    </Card>
  );
};

export default TrainingConfig;
