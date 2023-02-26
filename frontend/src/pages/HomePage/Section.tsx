import { ReactNode } from 'react';
import styled from 'styled-components';
import { Card } from '../../components/Card';

const Container = styled(Card)`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-column-gap: 24px;
  padding: 80px 48px;
  border-radius: 10px;
  margin: 200px 0;
  @media (max-width: 960px) {
    grid-template-columns: repeat(1, 1fr);
    grid-column-gap: 0;
    grid-row-gap: 24px;
  }
`;

const Title = styled.h1`
  font-size: 36px;
`;

const Description = styled.h3`
  margin-top: 20px;
  font-size: 24px;
`;

const Image = styled.img`
  object-fit: cover;
  object-position: center;
  width: 100%;
  height: 100%;
  border-radius: 10px;
`;

const Article = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
`;

const Section = ({
  img,
  title,
  description,
  imageLeft,
}: {
  img: string;
  title: string;
  description: ReactNode;
  imageLeft?: boolean;
}) => {
  return (
    <Container>
      {imageLeft ? (
        <>
          <Image src={img} />
          <Article>
            <Title>{title}</Title>
            <Description>{description}</Description>
          </Article>
        </>
      ) : (
        <>
          <Article>
            <Title>{title}</Title>
            <Description>{description}</Description>
          </Article>
          <Image src={img} />
        </>
      )}
    </Container>
  );
};

export default Section;
