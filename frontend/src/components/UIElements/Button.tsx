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

export default PrimaryButton;
