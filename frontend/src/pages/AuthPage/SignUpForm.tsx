import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';
import useLoginRedirect from '../../hooks/useLoginRedirect';
import useUserInfo from '../../hooks/useUserInfo';
import {
  APIResponse,
  APIResponseStatus,
  RegisterRequest,
} from '../../types/api';
import {
  nameOptions,
  emailOptions,
  passwordOptions,
} from '../../utils/validate';
import {
  InputField,
  InputContainer,
  Input,
  ErrorMessage,
  Button,
  Form,
  ButtonGroup,
  OutlineButton,
} from './styles';

const SignUpForm = () => {
  const navigate = useNavigate();
  useUserInfo();
  useLoginRedirect();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: 'a',
      email: 'a@a.a',
      password: 'aaaa',
    },
  });

  const registerMutation = useMutation<void, AxiosError, RegisterRequest>({
    mutationFn: (props) => api.register(props),
    onSuccess: () => navigate('/signin'),
    onError: ({ response }) => {
      if (response) {
        const apiResponse: APIResponse = response.data as APIResponse;
        if (apiResponse.status === APIResponseStatus.ERROR_EMAIL_EXIST) {
          setError('email', {
            message: 'Email already registered',
          });
        }
      }
    },
  });

  const buttonDisabled =
    registerMutation.isLoading ||
    errors.email !== undefined ||
    errors.name !== undefined ||
    errors.password !== undefined;

  return (
    <Form
      onSubmit={handleSubmit((data) => {
        registerMutation.mutate(data);
      })}
    >
      <InputField>
        <span>Name</span>
        <InputContainer>
          <Input
            placeholder="Enter your name"
            {...register('name', nameOptions)}
          />
        </InputContainer>
        <ErrorMessage>
          {errors.name ? errors.name.message : <>&nbsp;</>}
        </ErrorMessage>
      </InputField>
      <InputField>
        <span>Email</span>
        <InputContainer>
          <Input
            placeholder="Enter your email"
            {...register('email', emailOptions)}
          />
        </InputContainer>
        <ErrorMessage>
          {errors.email ? errors.email.message : <>&nbsp;</>}
        </ErrorMessage>
      </InputField>
      <InputField>
        <span>Password</span>
        <InputContainer>
          <Input
            type={'password'}
            placeholder="Enter your password"
            autoComplete="off"
            {...register('password', passwordOptions)}
          />
        </InputContainer>
        <ErrorMessage>
          {errors.password ? errors.password.message : <>&nbsp;</>}
        </ErrorMessage>
      </InputField>
      <ButtonGroup>
        <OutlineButton
          disabled={registerMutation.isLoading}
          onClick={() => navigate('/signin')}
        >
          Sign in
        </OutlineButton>
        <Button disabled={buttonDisabled} type="submit">
          Sign up
        </Button>
      </ButtonGroup>
    </Form>
  );
};

export default SignUpForm;
