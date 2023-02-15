import { ReactNode } from 'react';
import styled from 'styled-components';
import { PrimaryButton } from '../../components/Button';
import { Card } from '../../components/Card';
import { H3 } from '../../components/Typography';

const Container = styled(Card)`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-column-gap: 24px;
  margin-top: 36px;
  padding: 48px;
  border-radius: 10px;
  @media (max-width: 960px) {
    grid-template-columns: repeat(1, 1fr);
    grid-column-gap: 0;
    grid-row-gap: 24px;
  }
`;

const Image = styled.img`
  object-fit: cover;
  object-position: center;
  width: 100%;
  border-radius: 10px;
`;

const Article = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
`;

const BottomContainer = styled.div`
  display: flex;
  align-items: end;
  justify-content: space-between;
  width: 100%;
  flex-grow: 1;
`;

const StepButton = styled(PrimaryButton)`
  width: 150px;
`;

const TutorialCard = ({
  img,
  title,
  description,
  onNextStepClick,
  onPrevStepClick,
}: {
  img: string;
  title: string;
  description: ReactNode;
  onNextStepClick?: () => void;
  onPrevStepClick?: () => void;
}) => {
  return (
    <Container>
      <Image src={img} />
      <Article>
        <H3>{title}</H3>
        <p>{description}</p>
        <BottomContainer>
          <div>
            {onPrevStepClick && (
              <StepButton onClick={onPrevStepClick}>Previous Step</StepButton>
            )}
          </div>
          <div>
            {onNextStepClick && (
              <StepButton onClick={onNextStepClick}>Next Step</StepButton>
            )}
          </div>
        </BottomContainer>
      </Article>
    </Container>
  );
};

export default TutorialCard;
