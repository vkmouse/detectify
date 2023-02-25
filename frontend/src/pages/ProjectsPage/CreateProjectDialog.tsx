import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import api from '../../api/api';
import Modal, { ModalTitle } from '../../components/Modal';
import {
  InputField,
  InputContainer,
  Input,
  ErrorMessage,
} from '../../components/InputFiled';
import { projectNameOptions } from '../../utils/validate';
import { ButtonGroup, OutlineButton, Button } from './styles';
import styled from 'styled-components';

const CustomModal = styled(Modal)`
  width: 600px;
`;

const CreateProjectDialog = (props: { open: boolean; onClose: () => void }) => {
  const { open, onClose } = props;
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    setFocus,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      projectName: '',
    },
  });

  const addProjectMutation = useMutation({
    mutationFn: api.addProject,
    onSuccess: () => {
      queryClient.invalidateQueries(['projects']);
      onClose();
      reset();
    },
  });

  useEffect(() => {
    if (open) {
      setFocus('projectName');
    }
  }, [open]);

  return (
    <CustomModal open={open} onClose={onClose}>
      <ModalTitle>Create Project</ModalTitle>
      <form
        onSubmit={handleSubmit((data) => {
          addProjectMutation.mutate({
            name: data.projectName,
          });
        })}
      >
        <InputField>
          <span>Project Name</span>
          <InputContainer>
            <Input
              placeholder="Enter your project name"
              {...register('projectName', projectNameOptions)}
            />
          </InputContainer>
          <ErrorMessage>
            {errors.projectName ? errors.projectName.message : <>&nbsp;</>}
          </ErrorMessage>
        </InputField>
        <ButtonGroup>
          <OutlineButton type="button" onClick={onClose}>
            Cancel
          </OutlineButton>
          <Button type="submit">Create</Button>
        </ButtonGroup>
      </form>
    </CustomModal>
  );
};

export default CreateProjectDialog;
