import styled from 'styled-components';
import { OutlinePrimaryButton, PrimaryButton } from '../../components/Button';
import { Card } from '../../components/Card';

export const AuthContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
`;

export const AuthInnerContainer = styled.div`
  width: 100%;
  max-width: 600px;
  text-align: center;
  color: ${(props) => props.theme.colors.gray};
`;

export const Title = styled.h2`
  color: ${(props) => props.theme.colors.authTitleColor};
  font-weight: 500;
`;

export const CardBody = styled(Card)`
  display: flex;
  justify-content: center;
  padding: 20px;
  height: 100%;
  border-radius: 20px;
`;

export const Form = styled.form`
  width: 90%;
`;

export const Button = styled(PrimaryButton)`
  width: 120px;
  margin: 0;
`;

export const OutlineButton = styled(OutlinePrimaryButton)`
  width: 120px;
  margin: 0;
`;

export const ButtonGroup = styled.div`
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
`;
