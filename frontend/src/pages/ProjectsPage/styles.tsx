import styled from 'styled-components';
import PlusCircle from '../../assets/plus-circle.svg';
import {
  PrimaryButton,
  OutlineDangerButton,
  OutlinePrimaryButton,
} from '../../components/Button';

const borderRadius = 10;

export const CreateProjectContainer = styled(OutlinePrimaryButton)`
  position: relative;
  width: 100%;
  padding-top: calc(66.67% + 24px);
  font-size: 125%;
  user-select: none;
  border-radius: ${borderRadius}px;
  margin: 0;
`;

export const CreateProjectWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const CreateProjectIcon = styled(PlusCircle)`
  padding-right: 5px;
`;

export const InfoWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 5px 10px;
`;

export const Button = styled(PrimaryButton)`
  width: 120px;
  margin: 0;
`;

export const OutlineButton = styled(OutlineDangerButton)`
  width: 120px;
  margin: 0;
`;

export const ButtonGroup = styled.div`
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
`;
