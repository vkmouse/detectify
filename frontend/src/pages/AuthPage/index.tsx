import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';
import { AuthContainer, AuthInnerContainer, Title, CardBody } from './styles';

const SignInPage = () => {
  return (
    <AuthContainer>
      <AuthInnerContainer>
        <Title>Sign in</Title>
        <h3>to continue Detectify account</h3>
        <CardBody>
          <SignInForm />
        </CardBody>
      </AuthInnerContainer>
    </AuthContainer>
  );
};

const SignUpPage = () => {
  return (
    <AuthContainer>
      <AuthInnerContainer>
        <Title>Create your Detectify Account</Title>
        <h3>Easily detect objects in images with detectify</h3>
        <CardBody>
          <SignUpForm />
        </CardBody>
      </AuthInnerContainer>
    </AuthContainer>
  );
};

export { SignInPage, SignUpPage };
