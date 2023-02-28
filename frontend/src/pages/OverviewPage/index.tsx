import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { useProjectInfo } from '../../context/ProjectInfoContext';
import Canvas from '../../components/Canvas';
import { Card } from '../../components/Card';
import ImageCardCollection from '../../components/ImageCardCollection';
import useImageDrawer from '../../hooks/useImageDrawer';
import { ImageScaler } from '../../utils/ImageDrawer';
import { OutlinePrimaryButton } from '../../components/Button';
import { InferResponse } from '../../types/api';
import HelpIcon from '../../assets/help-circle.svg';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { Loading } from '../../components/Loading';
import UploadButton from '../../components/UploadButton';
import Tutorial from '../../components/Tutorial';
import TutorialInfo from './TutorialInfo';

const Container = styled.div`
  display: grid;
  grid-template-columns: 80% 20%;
  column-gap: 10px;
  row-gap: 10px;
  margin-right: 10px;
  @media (max-width: 600px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;

const CanvasWrapper = styled(Card)`
  position: relative;
  width: 100%;
  height: 0;
  padding-top: 66.67%;
`;

const CustomCanvas = styled(Canvas)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const AdvanceContainer = styled(Card)`
  margin-top: 10px;
  padding: 10px;
`;

const FlexContainer = styled.div`
  display: flex;
`;

const AdvanceToggle = styled(OutlinePrimaryButton)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const InputContainer = styled.div`
  margin-top: 11px;
  padding-right: 32px;
`;

const Input = styled.input`
  padding: 10px 15px;
  width: 100%;
  border: 1px solid ${(props) => props.theme.colors.gray400};
  border-radius: 5px;
  color: inherit;
  background-color: inherit;
  font: inherit;
  &:focus {
    outline: none;
    border: 1px solid ${(props) => props.theme.colors.primary};
    box-shadow: 0 0 4px ${(props) => props.theme.colors.primary};
  }
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

const Overlay = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
`;

const OutlineUploadButton = styled(UploadButton)`
  background: ${(props) => props.theme.colors.bodyBackground};
  border: 1px solid ${(props) => props.theme.colors.primary};
  color: ${(props) => props.theme.colors.primary};

  &:hover {
    background: ${(props) => props.theme.colors.primary};
    color: white;
    &:disabled {
      background: ${(props) => props.theme.colors.bodyBackground};
      color: ${(props) => props.theme.colors.primary};
    }
  }
`;

const PredictPage = () => {
  const scalerRef = useRef<ImageScaler>(new ImageScaler());
  const [bboxes, setBboxes] = useState<InferResponse[]>([]);
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [advance, setAdvance] = useState(false);
  const canvasRef = useImageDrawer(bboxes, null, img, scalerRef.current);
  const { images, webModel } = useProjectInfo();
  const [isDetecting, setIsDetecting] = useState(false);

  const methods = useForm({
    defaultValues: {
      threshold: 0.5,
    },
  });

  const detect = async (url: string) => {
    setIsDetecting(true);
    const bboxes = await webModel.detect(url, methods.getValues().threshold);
    setBboxes(bboxes);
    setIsDetecting(false);
  };

  return (
    <FormProvider {...methods}>
      <Container>
        <CanvasWrapper>
          <CustomCanvas ref={canvasRef} />
          <Overlay>
            <OutlineUploadButton
              accept=".jpg,.jpeg,.png"
              onUploadChange={(files) => {
                if (files.length > 0) {
                  const image = new Image();
                  const url = URL.createObjectURL(files[0]);
                  image.src = url;
                  image.onload = () => {
                    setImg(image);
                    setBboxes([]);
                    detect(image.src);
                  };
                }
              }}
            >
              Try your image
            </OutlineUploadButton>
          </Overlay>
          {isDetecting && <Loading />}
        </CanvasWrapper>
        <ImageCardCollection
          images={images}
          onImageCardClick={(img) => {
            setImg(img);
            setBboxes([]);
            detect(img.src);
          }}
        />
      </Container>
      <AdvanceContainer>
        <FlexContainer>
          <AdvanceToggle onClick={() => setAdvance((advance) => !advance)}>
            Advance Option
          </AdvanceToggle>
        </FlexContainer>
        <div>{advance && <Threshold />}</div>
      </AdvanceContainer>
      <br />
      <br />
      <Tutorial tutorialInfo={TutorialInfo} />
    </FormProvider>
  );
};

function Threshold() {
  const { register } = useFormContext();
  return (
    <InputContainer>
      <FieldTitle>
        Threshold &nbsp;
        <Tooltip>
          <HelpIcon />
          <TooltipText>
            Threshold of detection model decides if a predicted output is
            considered a positive detection, with the threshold value balancing
            precision and recall for a specific use case.
          </TooltipText>
        </Tooltip>
      </FieldTitle>
      <Input
        placeholder="Enter threshold"
        {...register('threshold', {
          valueAsNumber: true,
          validate: (value) => 0 <= value && value <= 1,
        })}
      />
    </InputContainer>
  );
}

export default PredictPage;
