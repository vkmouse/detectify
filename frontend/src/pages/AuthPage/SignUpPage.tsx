import SignUpForm from './SignUpForm';
import { AuthContainer, AuthInnerContainer, Title, CardBody } from './styles';

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

export default SignUpPage;
