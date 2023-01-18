import styled from 'styled-components';

const Card = styled.div`
  background: ${(props) => props.theme.colors.cardBackground};
  border-radius: 3px;
  box-shadow: 0 0 0.875rem 0 rgb(41 48 66 / 5%);
`;

const CardPrimary = styled(Card)`
  background: ${(props) => props.theme.colors.cardBackgroundPrimary};
`;

export { Card, CardPrimary };
