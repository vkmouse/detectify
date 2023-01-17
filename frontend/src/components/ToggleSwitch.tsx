import React from 'react';
import styled from 'styled-components';

const SwitchContainer = styled.label`
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
  border-radius: 50%;
`;

const Slider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: 0.4s;
  transition: 0.4s;
  border-radius: 34px;
  &:before {
    position: absolute;
    content: '';
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    -webkit-transition: 0.4s;
    transition: 0.4s;
    border-radius: 50%;
  }
  &.round {
    border-radius: 34px;
  }
`;

const Label = styled.span`
  position: absolute;
  top: 4px;
  left: 4px;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background-color: white;
  -webkit-transition: 0.4s;
  transition: 0.4s;
  &:before {
    position: absolute;
    content: '';
    -webkit-transform: translateX(26px);
    -ms-transform: translateX(26px);
    transform: translateX(26px);
    -webkit-transition: 0.4s;
    transition: 0.4s;
  }
`;

const CheckboxInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
  &:checked + ${Slider} {
    background-color: ${(props) => props.theme.colors.primary};
  }
  &:focus + ${Slider} {
    box-shadow: 0 0 1px ${(props) => props.theme.colors.primary};
  }
  &:checked + ${Slider}:before {
    -webkit-transform: translateX(26px);
    -ms-transform: translateX(26px);
    transform: translateX(26px);
  }
  &:checked + ${Label}:before {
    -webkit-transform: translateX(26px);
    -ms-transform: translateX(26px);
    transform: translateX(26px);
  }
`;

const ToggleSwitch = (props: {
  checked?: boolean;
  onChange?: (value: boolean) => void;
}) => {
  const { checked, onChange } = props;
  return (
    <SwitchContainer>
      <CheckboxInput
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
        type="checkbox"
      />
      <Slider />
    </SwitchContainer>
  );
};

export default ToggleSwitch;
