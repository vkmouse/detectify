import { ReactNode, useState } from 'react';
import { H3 } from './Typography';
import {
  RadioButton,
  RadioButtonGroup,
} from '../pages/ServerPage/RadioButtonGroup';
import TutorialCard from './TutorialCard';

export type TutorialCardInfo = {
  name: string;
  img: string;
  title: string;
  description: ReactNode;
};

export type TutorialInfo = {
  title: string;
  description: ReactNode;
  cards: TutorialCardInfo[];
};

const Tutorial = (props: { tutorialInfo: TutorialInfo }) => {
  const [info, setInfo] = useState(props.tutorialInfo.cards[0]);
  const [selected, setSelected] = useState(0);

  const handleClick = (index: number) => {
    if (selected !== index) {
      setSelected(index);
      setInfo(props.tutorialInfo.cards[index]);
    }
  };

  return (
    <>
      <H3>{props.tutorialInfo.title}</H3>
      {props.tutorialInfo.description}
      <RadioButtonGroup cols={props.tutorialInfo.cards.length}>
        {props.tutorialInfo.cards.map((p, i) => (
          <RadioButton
            key={i}
            selected={selected === i}
            onClick={() => handleClick(i)}
          >
            {p.name}
          </RadioButton>
        ))}
      </RadioButtonGroup>
      <TutorialCard
        {...info}
        onPrevStepClick={
          selected !== 0 ? () => handleClick(selected - 1) : undefined
        }
        onNextStepClick={
          selected !== props.tutorialInfo.cards.length - 1
            ? () => handleClick(selected + 1)
            : undefined
        }
      />
    </>
  );
};

export default Tutorial;
