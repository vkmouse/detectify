import styled from 'styled-components';
import { Card } from '../../../components/Card';

const HotizentalImageList = styled.div`
  display: flexbox;
  overflow: auto;
  margin-bottom: 10px;
`;

const ImageCardContainer = styled.div`
  width: 150px;
  padding: 0 5px 5px 5px;
`;

const CanvasWrapper = styled.div`
  position: relative;
  width: 100%;
  padding-top: 56.25%;
`;

const CanvasInnerWrapper = styled(Card)`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
`;

export {
  CanvasWrapper,
  CanvasInnerWrapper,
  HotizentalImageList,
  ImageCardContainer,
};
