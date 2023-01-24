import styled from 'styled-components';

export const InputField = styled.div`
  margin: 10px 0 0px 0;
  text-align: left;
  user-select: none;
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

export const ErrorMessage = styled.span`
  font-size: small;
  color: ${(props) => props.theme.colors.danger};
`;
