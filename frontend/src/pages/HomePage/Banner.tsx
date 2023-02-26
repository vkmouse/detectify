import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { PrimaryButton } from '../../components/Button';
import { H1, H3 } from '../../components/Typography';

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

const Title = styled(H1)`
  font-size: 36px;
  max-width: 800px;
  color: white;
  @media (max-width: 600px) {
    font-size: 24px;
  }
`;

const Description = styled(H3)`
  margin-top: 40px;
  max-width: 800px;
  font-size: 24px;
  color: white;
  @media (max-width: 600px) {
    font-size: 16px;
  }
`;

const ButtonContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  margin-top: 20px;
  column-gap: 30px;
  @media (max-width: 600px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;

const Button = styled(PrimaryButton)`
  width: 250px;
  height: 55px;
  font-size: 24px;
  @media (max-width: 600px) {
    width: 180px;
    height: 40px;
    font-size: 16px;
  }
`;

const Banner = () => {
  return (
    <Wrapper>
      <Title>Easily Create an Object Detection Service</Title>
      <Description>
        Access existing object detection services or create your own with ease.
        Detectify provides annotation and training capabilities to help you.
      </Description>
      <ButtonContainer>
        <Link to="signin">
          <Button>Log In</Button>
        </Link>
        <Link to="signup">
          <Button>Create Account</Button>
        </Link>
      </ButtonContainer>
    </Wrapper>
  );
};

export default Banner;
