import { ReactNode } from 'react';
import styled from 'styled-components';

const TitleContainer = styled.div`
  margin: 0 0 20px 0;
`;

const Title = styled.div`
  font-size: 1.25rem;
`;

const ProjectPageContainer = ({
  name,
  children,
}: {
  name: string;
  children: ReactNode;
}) => {
  return (
    <>
      <TitleContainer>
        <Title>{name}</Title>
      </TitleContainer>
      {children}
    </>
  );
};

export default ProjectPageContainer;
