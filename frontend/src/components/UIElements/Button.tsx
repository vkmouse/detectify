import styled from 'styled-components';

const Button = styled.button`
  margin: 3px;
  padding: 5px 10px;
  border: 0;
  border-radius: 5px;
  cursor: pointer;
`;

const PrimaryButton = styled(Button)`
  background: ${(props) => props.theme.colors.primary};
  color: white;
  &:hover {
    background: #3266bb;
  }
`;

export default PrimaryButton;
