import { ReactNode } from 'react';
import styled from 'styled-components';
import { OutlinePrimaryButton, PrimaryButton } from '../../components/Button';

const ButtonGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
`;

const RadioButton = ({
  selected,
  children,
  onClick,
}: {
  selected: boolean;
  children: ReactNode;
  onClick: () => void;
}) => {
  if (selected) {
    return <PrimaryButton onClick={onClick}>{children}</PrimaryButton>;
  }
  return (
    <OutlinePrimaryButton onClick={onClick}>{children}</OutlinePrimaryButton>
  );
};

const RadioButtonGroup = ({ children }: { children: ReactNode }) => {
  return <ButtonGroup>{children}</ButtonGroup>;
};

export { RadioButtonGroup, RadioButton };
