import styled from 'styled-components';

const Button = styled.button`
  margin: 3px;
  padding: 5px 10px;
  border: 0;
  border-radius: 5px;
  cursor: pointer;

  &:disabled {
    opacity: ${(props) => props.theme.buttonDisabledOpacity};
    cursor: not-allowed;
  }
`;

const PrimaryButton = styled(Button)`
  background: ${(props) => props.theme.colors.primary};
  color: white;
  &:hover {
    background: #3266bb;
    &:disabled {
      background: ${(props) => props.theme.colors.primary};
    }
  }
`;

const DangerButton = styled(Button)`
  background: ${(props) => props.theme.colors.danger};
  color: white;
  &:hover {
    background: #b84743;
    &:disabled {
      background: ${(props) => props.theme.colors.danger};
    }
  }
`;

const OutlinePrimaryButton = styled(Button)`
  background: ${(props) => props.theme.colors.bodyBackground};
  border: 1px solid ${(props) => props.theme.colors.primary};
  color: ${(props) => props.theme.colors.primary};

  &:hover {
    background: ${(props) => props.theme.colors.primary};
    color: white;
    &:disabled {
      background: ${(props) => props.theme.colors.bodyBackground};
      color: ${(props) => props.theme.colors.primary};
    }
  }
`;

const OutlineDangerButton = styled(Button)`
  background: ${(props) => props.theme.colors.bodyBackground};
  border: 1px solid ${(props) => props.theme.colors.danger};
  color: ${(props) => props.theme.colors.danger};

  &:hover {
    background: ${(props) => props.theme.colors.danger};
    color: white;
    &:disabled {
      background: ${(props) => props.theme.colors.bodyBackground};
      color: ${(props) => props.theme.colors.danger};
    }
  }
`;

export {
  PrimaryButton,
  DangerButton,
  OutlinePrimaryButton,
  OutlineDangerButton,
};
