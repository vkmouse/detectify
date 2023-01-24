import styled from 'styled-components';
import PlusCircle from '../../assets/plus-circle.svg';
import { PrimaryButton, OutlinePrimaryButton } from '../../components/Button';

const borderRadius = 10;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  padding: 0 20px;
  grid-column-gap: 1%;
  grid-row-gap: 3%;
  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
    grid-column-gap: 3%;
  }
  @media (max-width: 600px) {
    grid-template-columns: repeat(1, 1fr);
    grid-column-gap: 0;
    grid-row-gap: 1%;
  }
`;

export const Card = styled.div`
  cursor: pointer;
  box-shadow: 0 0 2rem 0 rgb(41 48 66 / 15%);
  font-size: 90%;
  background-color: ${(props) => props.theme.colors.cardBackground};
  border-radius: ${borderRadius}px;
`;

export const CreateProjectContainer = styled.div`
  position: relative;
  width: 100%;
  padding-top: calc(66.67% + 31.25px);
  font-size: 125%;
  user-select: none;
  border-radius: ${borderRadius}px;
  &:hover {
    background: ${(props) => props.theme.colors.cardBackgroundPrimary};
  }
`;

export const CreateProjectWrapper = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const CreateProjectIcon = styled(PlusCircle)`
  padding-right: 5px;
`;

export const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  padding-top: 66.67%;
`;

export const Image = styled.img`
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  border-radius: ${borderRadius}px ${borderRadius}px 0 0;
`;

export const InfoContainer = styled.div`
  display: none;
  position: absolute;
  top: 0;
  width: 100%;
  background: black;
  color: white;
  box-shadow: 0 0 20px black;
  opacity: 50%;
  border-radius: ${borderRadius}px ${borderRadius}px 0 0;
  ${Card}:hover & {
    display: block;
  }
`;

export const InfoWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 5px 10px;
`;

export const NameDateContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 5px 10px;
  border-radius: 0 0 ${borderRadius}px ${borderRadius}px;
`;

export const Name = styled.span`
  font-weight: bold;
`;

export const DateModified = styled.span`
  color: ${(props) => props.theme.colors.gray};
`;

export const Button = styled(PrimaryButton)`
  width: 120px;
  margin: 0;
`;

export const OutlineButton = styled(OutlinePrimaryButton)`
  width: 120px;
  margin: 0;
`;

export const ButtonGroup = styled.div`
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
`;
