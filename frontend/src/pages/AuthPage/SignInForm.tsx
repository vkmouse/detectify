import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';
import { APIResponse, APIResponseStatus } from '../../types/api';
import { emailOptions, passwordOptions } from '../../utils/validate';
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

const SignInForm = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    getValues,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: 'a@a.a',
      password: 'aaaa',
    },
  });

  const loginQuery = useQuery({
    queryKey: ['login'],
    queryFn: () => api.login(getValues()),
    onSuccess: (response) => {
      const apiResponse: APIResponse = response.data as APIResponse;
      const { accessToken } = apiResponse.data as { accessToken: string };
      console.log(accessToken);
    },
    onError: ({ response }) => {
      const apiResponse: APIResponse = response.data as APIResponse;
      switch (apiResponse.status) {
        case APIResponseStatus.ERROR_EMAIL_NOT_EXIST: {
          setError('email', {
            message: 'Email not found.',
          });
          break;
        }
        case APIResponseStatus.ERROR_PASSWORD_ERROR: {
          setError('password', {
            message: 'Incorrect password',
          });
          break;
        }
      }
    },
    enabled: false,
    retry: false,
  });

  const buttonDisabled =
    loginQuery.isFetching ||
    errors.email !== undefined ||
    errors.password !== undefined;

  return (
    <Form onSubmit={handleSubmit(() => loginQuery.refetch())}>
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
          disabled={loginQuery.isFetching}
          onClick={() => navigate('/signup')}
        >
          Sign up
        </OutlineButton>
        <Button disabled={buttonDisabled} type="submit">
          Sign in
        </Button>
      </ButtonGroup>
    </Form>
  );
};

export default SignInForm;
