import styled from 'styled-components';
import UploadButton from '../../components/UploadButton';

export const UploadColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

export const UploadContainer = styled.div`
  width: 100%;
`;

export const UploadLayout = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 50%);
  grid-column-gap: 10px;
  @media (max-width: 960px) {
    grid-template-columns: 100%;
    grid-column-gap: 0;
  }
`;

export const FilePicker = styled.div`
  flex-grow: 1;
  background: gray;
  margin: 0 10px;
`;

export const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 5px;
  width: 100%;
  @media (max-width: 960px) {
    flex-direction: column;
  }
`;

export const ProgressContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow: auto;
  border: 1px dashed ${(props) => props.theme.colors.bodyColor};
`;

export const ProgressWrapper = styled.div`
  padding: 5px;
  height: 100%;
`;

export const Button = styled(UploadButton)`
  margin: 3px 10px;
  max-width: 150px;
  width: 100%;
  cursor: pointer;
`;
