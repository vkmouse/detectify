import ModelExport from './ModelExport';
import TrainingConfig from './TrainingConfig';
import TrainingStatus from './TrainingStatus';

const TrainPage = () => {
  return (
    <>
      <TrainingConfig />
      <TrainingStatus />
      <ModelExport />
    </>
  );
};

export default TrainPage;
