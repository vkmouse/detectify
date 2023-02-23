import React, { useRef, useState } from 'react';
import api from '../../api/api';
import styled from 'styled-components';
import { useProjectInfo } from '../../context/ProjectInfoContext';
import Canvas from '../../components/Canvas';
import { Card } from '../../components/Card';
import ImageCardCollection from '../../components/ImageCardCollection';
import useImageDrawer from '../../hooks/useImageDrawer';
import { ImageScaler } from '../../utils/ImageDrawer';
import { OutlinePrimaryButton, PrimaryButton } from '../../components/Button';
import { InferResponse } from '../../types/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import HelpIcon from '../../assets/help-circle.svg';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { Loading } from '../../components/Loading';
import UploadButton from '../../components/UploadButton';

const Container = styled.div`
  display: grid;
  grid-template-columns: 80% 20%;
  column-gap: 10px;
  row-gap: 10px;
  margin-right: 10px;
`;

const CanvasWrapper = styled(Card)`
  position: relative;
  width: 100%;
  height: 0;
  padding-top: 75%;
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
  width: calc(80% - 10px);
  margin: 0 10px 0 0;
`;

const Button = styled(PrimaryButton)`
  flex-grow: 1;
  margin: 0 0 0 10px;
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
  const queryClient = useQueryClient();
  const scalerRef = useRef<ImageScaler>(new ImageScaler());
  const requestId = useRef('');
  const [bboxes, setBboxes] = useState<InferResponse[]>([]);
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [advance, setAdvance] = useState(false);
  const canvasRef = useImageDrawer(bboxes, null, img, scalerRef.current);
  const { irModel } = useProjectInfo();
  const { images } = useProjectInfo();

  const methods = useForm({
    defaultValues: {
      threshold: 0.5,
    },
  });

  const inferWithURLMutate = useMutation<boolean, Error, string>(
    async (imageURL) => {
      requestId.current = await api.createInferRequest(irModel);
      const success = await api.inferWithURL(requestId.current, imageURL);
      if (success) {
        return Promise.resolve(false);
      }
      return Promise.reject(true);
    },
    { onSuccess: () => queryClient.invalidateQueries(['inferResult']) }
  );

  const inferWithImageMutate = useMutation<boolean, Error, File>(
    async (image) => {
      requestId.current = await api.createInferRequest(irModel);
      const success = await api.inferWithImage(requestId.current, image);
      if (success) {
        return Promise.resolve(false);
      }
      return Promise.reject(true);
    },
    { onSuccess: () => queryClient.invalidateQueries(['inferResult']) }
  );

  useQuery({
    queryKey: ['inferResult'],
    queryFn: async () => api.getInferResult(requestId.current),
    onSuccess: (data) => {
      if (data.status === 'completed') {
        const bboxes = data.results.filter(
          (p) => p.confidence > methods.getValues().threshold
        );
        setBboxes(bboxes);
        requestId.current = '';
      }
    },
    enabled: requestId.current !== '',
    refetchInterval: 1000,
  });

  const isLoading =
    inferWithImageMutate.isLoading ||
    inferWithURLMutate.isLoading ||
    requestId.current !== '';

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
                  inferWithImageMutate.mutate(files[0]);
                  const url = URL.createObjectURL(files[0]);
                  const image = new Image();
                  image.src = url;
                  image.onload = () => {
                    setImg(image);
                    setBboxes([]);
                  };
                }
              }}
            >
              Try your image
            </OutlineUploadButton>
          </Overlay>
          {isLoading && <Loading />}
        </CanvasWrapper>
        <ImageCardCollection
          images={images}
          onImageCardClick={(img) => {
            setImg(img);
            setBboxes([]);
          }}
        />
      </Container>
      <AdvanceContainer>
        <FlexContainer>
          <AdvanceToggle onClick={() => setAdvance((advance) => !advance)}>
            Advance Option
          </AdvanceToggle>
          <Button
            disabled={isLoading}
            onClick={() => {
              if (img) {
                inferWithURLMutate.mutate(img?.src);
              }
            }}
          >
            Detection
          </Button>
        </FlexContainer>
        <div>{advance && <Threshold />}</div>
      </AdvanceContainer>
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
