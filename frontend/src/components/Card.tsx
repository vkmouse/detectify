import styled from 'styled-components';

const Card = styled.div`
  background: ${(props) => props.theme.colors.cardBackground};
  border-radius: 10px;
  box-shadow: 0 7px 14px 0 rgba(65, 69, 88, 0.05),
    0 3px 6px 0 rgba(0, 0, 0, 0.07);
`;

const CardPrimary = styled(Card)`
  background: ${(props) => props.theme.colors.cardBackgroundPrimary};
`;

export { Card, CardPrimary };
