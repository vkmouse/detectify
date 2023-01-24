import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import api from '../../api/api';
import Dialog, { DialogTitle } from '../../components/Dialog';
import {
  InputField,
  InputContainer,
  Input,
  ErrorMessage,
} from '../../components/InputFiled';
import { projectNameOptions } from '../../utils/validate';
import { ButtonGroup, OutlineButton, Button } from './styles';

const CreateProjectDialog = (props: { open: boolean; onClose: () => void }) => {
  const { open, onClose } = props;
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors },
  } = useForm({
    defaultValues: {
      projectName: '',
      projectDescription: '',
    },
  });

  const addProjectMutation = useMutation({
    mutationFn: api.addProject,
    onSuccess: () => {
      queryClient.invalidateQueries(['projects']);
      onClose();
    },
  });

  useEffect(() => {
    if (open) {
      setFocus('projectName');
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create Project</DialogTitle>
      <form
        onSubmit={handleSubmit((data) =>
          addProjectMutation.mutate({
            name: data.projectName,
          })
        )}
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
        <InputField>
          <span>Project Description</span>
          <InputContainer>
            <Input
              placeholder="Enter your project description"
              {...register('projectDescription')}
            />
          </InputContainer>
          &nbsp;
        </InputField>
        <ButtonGroup>
          <OutlineButton type="button" onClick={onClose}>
            Cancel
          </OutlineButton>
          <Button type="submit">Create</Button>
        </ButtonGroup>
      </form>
    </Dialog>
  );
};

export default CreateProjectDialog;