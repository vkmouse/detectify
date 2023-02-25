import { ReactNode } from 'react';
import styled from 'styled-components';
import { OutlinePrimaryButton, PrimaryButton } from '../../components/Button';

const ButtonGroup = styled.div<{ cols: number }>`
  display: grid;
  grid-template-columns: repeat(${(props) => props.cols}, 1fr);
  column-gap: 10px;
  padding: 32px 0;
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

const RadioButtonGroup = ({
  children,
  cols,
}: {
  children: ReactNode;
  cols: number;
}) => {
  return <ButtonGroup cols={cols}>{children}</ButtonGroup>;
};

export { RadioButtonGroup, RadioButton };
