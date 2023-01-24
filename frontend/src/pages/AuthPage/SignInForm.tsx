import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import {
  InputField,
  InputContainer,
  Input,
  ErrorMessage,
} from '../../components/InputFiled';
import useLogin from '../../hooks/useLogin';
import useLoginRedirect from '../../hooks/useLoginRedirect';
import useUserInfo from '../../hooks/useUserInfo';
import { emailOptions, passwordOptions } from '../../utils/validate';
import { Button, Form, ButtonGroup, OutlineButton } from './styles';

const SignInForm = () => {
  const navigate = useNavigate();
  const { isFetching } = useUserInfo();
  const loginRedirect = useLoginRedirect();

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

  const login = useLogin({
    onSuccess: () => loginRedirect(true),
    onEmailNotExist: () =>
      setError('email', {
        message: 'Email not found.',
      }),
    onPasswordError: () =>
      setError('password', {
        message: 'Incorrect password',
      }),
  });

  const buttonDisabled =
    isFetching || errors.email !== undefined || errors.password !== undefined;

  return (
    <Form onSubmit={handleSubmit(() => login(getValues()))}>
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
          disabled={isFetching}
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
