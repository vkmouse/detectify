import {
  Card,
  Image,
  ImageContainer,
  InfoContainer,
  InfoWrapper,
  NameDateContainer,
  Name,
  DateModified,
} from './styles';

const ProjectCard = (props: {
  cover: string;
  dateModified: Date;
  name: string;
  numCategories: number;
  numImages: number;
}) => {
  const { cover, dateModified, name, numCategories, numImages } = props;

  return (
    <Card>
      <ImageContainer>
        <Image src={cover} />
        <InfoContainer>
          <InfoWrapper>
            <span>Category: {numCategories}</span>
            <span>images: {numImages}</span>
          </InfoWrapper>
        </InfoContainer>
      </ImageContainer>
      <NameDateContainer>
        <Name>{name}</Name>
        <DateModified>
          modified {calculateTimeDifference(dateModified)} age
        </DateModified>
      </NameDateContainer>
    </Card>
  );
};

function calculateTimeDifference(date: Date) {
  const currentDate = new Date();
  const differenceInTime = currentDate.getTime() - date.getTime();
  const differenceInMinutes = differenceInTime / (1000 * 60);
  if (differenceInMinutes < 60) {
    return `${Math.round(differenceInMinutes)} minutes`;
  }
  const differenceInHours = differenceInMinutes / 60;
  if (differenceInHours < 24) {
    return `${Math.round(differenceInHours)} hours`;
  }
  const differenceInDays = differenceInHours / 24;
  return `${Math.round(differenceInDays)} days`;
}

export default ProjectCard;
