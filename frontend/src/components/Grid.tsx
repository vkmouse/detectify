import styled from 'styled-components';

const Grid421 = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-column-gap: 1%;
  grid-row-gap: 10px;
  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
    grid-column-gap: 3%;
  }
  @media (max-width: 600px) {
    grid-template-columns: repeat(1, 1fr);
    grid-column-gap: 0;
  }
`;

export { Grid421 };
