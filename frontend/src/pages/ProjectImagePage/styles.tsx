import styled from 'styled-components';
import { PrimaryButton } from '../../components/UIElements/Button';

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
  grid-template-rows: 500px;
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
  max-width: 400px;
`;

export const ProgressWrapper = styled.div`
  overflow: auto;
  padding: 0 10px;
  height: 100%;
`;

export const Button = styled(PrimaryButton)`
  margin: 3px 10px;
  width: 150px;
  cursor: pointer;
`;
