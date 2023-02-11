import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import { PrimaryButton } from '../../components/Button';
import ImageCardCollection from '../../components/ImageCardCollection';
import { Input, InputContainer, InputField } from '../../components/InputFiled';
import { useProjectInfo } from '../../context/ProjectInfoContext';

const Container = styled.div`
  display: flex;
  position: relative;
  padding-left: calc(100% - 5px);
  padding-top: 100%;
  margin-left: 5px;
`;

const InputCard = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: end;
  position: absolute;
  width: 100%;
  height: 30%;
  top: 70%;
  left: 0;
`;

const Button = styled(PrimaryButton)`
  width: 100%;
  padding-left: 0;
  padding-right: 0;
  margin-left: 0;
  margin-right: 0;
`;

const InputGroup = ({
  disabled,
  onImageCardClick,
  onDetectionClick,
}: {
  disabled?: boolean;
  onImageCardClick?: (element: HTMLImageElement) => void;
  onDetectionClick?: (threshold: number) => void;
}) => {
  const { images } = useProjectInfo();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      value: 0.5,
    },
  });

  return (
    <Container>
      <ImageCardCollection
        images={images}
        height={'65%'}
        onImageCardClick={onImageCardClick}
      />
      <InputCard>
        <form
          onSubmit={handleSubmit(() => {
            onDetectionClick?.(getValues().value);
          })}
        >
          <InputField>
            <span>Threshold</span>
            <InputContainer>
              <Input
                placeholder="Enter threshold"
                {...register('value', {
                  valueAsNumber: true,
                  validate: (value) => value > 0,
                })}
              />
            </InputContainer>
          </InputField>
          <Button
            type="submit"
            disabled={disabled || errors.value !== undefined}
          >
            Detect
          </Button>
        </form>
      </InputCard>
    </Container>
  );
};
export default InputGroup;
