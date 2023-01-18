import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const navigate = useNavigate();

  return (
    <Form onSubmit={handleSubmit((data) => console.log(data))}>
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
        <OutlineButton onClick={() => navigate('/signup')}>
          Sign up
        </OutlineButton>
        <Button type="submit">Sign in</Button>
      </ButtonGroup>
    </Form>
  );
};

export default SignInForm;
