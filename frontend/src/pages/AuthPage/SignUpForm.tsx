import { useForm } from 'react-hook-form';
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
} from './styles';

const SignUpForm = () => {
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

  return (
    <Form onSubmit={handleSubmit((data) => console.log(data))}>
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
      <Button type="submit">Sign up</Button>
    </Form>
  );
};

export default SignUpForm;
