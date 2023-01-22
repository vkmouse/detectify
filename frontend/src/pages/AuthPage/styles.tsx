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

export const InputContainer = styled.div`
  margin-top: 5px;
  padding-right: 32px;
`;

export const Input = styled.input`
  padding: 10px 15px;
  width: 100%;
  border: 1px solid ${(props) => props.theme.colors.gray400};
  border-radius: 5px;
  color: inherit;
  background-color: inherit;
  font: inherit;
  &:focus {
    outline: none;
    border: 1px solid ${(props) => props.theme.colors.primary};
    box-shadow: 0 0 4px ${(props) => props.theme.colors.primary};
  }
`;

export const InputField = styled.div`
  margin: 10px 0 0px 0;
  text-align: left;
  user-select: none;
`;

export const Button = styled(PrimaryButton)`
  width: 120px;
  margin: 0;
`;

export const OutlineButton = styled(OutlinePrimaryButton)`
  width: 120px;
  margin: 0;
`;

export const ErrorMessage = styled.span`
  font-size: small;
  color: ${(props) => props.theme.colors.danger};
`;

export const ButtonGroup = styled.div`
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
`;
