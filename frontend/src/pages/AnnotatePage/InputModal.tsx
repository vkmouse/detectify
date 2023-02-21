import { useState } from 'react';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import { PrimaryButton, OutlineDangerButton } from '../../components/Button';
import Dropdowns from '../../components/Dropdowns';
import {
  ErrorMessage,
  Input,
  InputContainer,
  InputField,
} from '../../components/InputFiled';
import Modal, { ModalTitle } from '../../components/Modal';

const CustomModal = styled(Modal)`
  width: 600px;
`;

const Button = styled(PrimaryButton)`
  width: 120px;
  margin: 0;
`;

const OutlineButton = styled(OutlineDangerButton)`
  width: 120px;
  margin: 0;
`;

const ButtonGroup = styled.div`
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
`;

const InputModal = ({
  open,
  onClose,
  onSuccess,
  onCancel,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess?: (category: string) => void;
  onCancel?: () => void;
}) => {
  const categoryList = ['cat', 'dog', 'apple'];
  const initialCategory = categoryList.length > 0 ? categoryList[0] : '';
  const [category, setCategory] = useState(initialCategory);
  const { register, handleSubmit, setValue } = useForm({
    defaultValues: {
      category: initialCategory,
    },
  });

  const handleCancel = () => {
    onCancel?.();
    onClose();
  };

  return (
    <CustomModal open={open} onClose={handleCancel}>
      <form
        onSubmit={handleSubmit(({ category }) => {
          onSuccess?.(category);
          onClose();
        })}
      >
        <ModalTitle>Category Name</ModalTitle>
        <InputField>
          <InputContainer>
            <Input
              placeholder="Enter category name"
              {...register('category')}
              onChange={(e) => {
                setCategory(e.target.value);
              }}
            />
          </InputContainer>
          <ErrorMessage>&nbsp;</ErrorMessage>
          <Dropdowns
            value={category}
            items={categoryList.map((p) => ({ value: p, text: p }))}
            onSelectedChange={(value) => {
              setValue('category', value);
              setCategory(value);
            }}
          />
        </InputField>
        <ButtonGroup>
          <OutlineButton type="button" onClick={handleCancel}>
            Cancel
          </OutlineButton>
          <Button type="submit">OK</Button>
        </ButtonGroup>
      </form>
    </CustomModal>
  );
};

export default InputModal;
