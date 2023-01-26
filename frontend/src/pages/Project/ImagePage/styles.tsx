import styled from 'styled-components';
import { PrimaryButton } from '../../../components/Button';

export const UploadColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

export const UploadContainer = styled.div`
  width: 100%;
`;

export const UploadLayout = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-column-gap: 1%;
  grid-row-gap: 1%;
  grid-template-rows: 300px;
  @media (max-width: 600px) {
    grid-template-columns: repeat(1, 1fr);
    grid-column-gap: 0;
    grid-row-gap: 1%;
  }
`;

export const FilePicker = styled.div`
  flex-grow: 1;
  background: gray;
  margin: 0 10px;
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 5px;
`;

export const ProgressContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow: auto;
  border: 1px dashed ${(props) => props.theme.colors.bodyColor};
  border-radius: 10px;
`;

export const ProgressWrapper = styled.div`
  padding: 5px;
  height: 100%;
`;

export const Button = styled(PrimaryButton)`
  margin: 3px 10px;
  width: 150px;
  cursor: pointer;
`;
