import styled from 'styled-components';

export const Form = styled.form`
  padding: 20px;
  margin-bottom: 20px;
`;

export const Title = styled.span`
  font-weight: bold;
  font-size: 110%;
`;

export const InputGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  column-gap: 12px;
  row-gap: 12px;
  margin-top: 6px;
  @media (max-width: 960px) {
    grid-template-columns: repeat(1, 1fr);
    grid-column-gap: 0;
    grid-row-gap: 12px;
  }
`;
