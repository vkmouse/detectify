import { TrainingInfoProvider } from '../../context/TrainingInfoContext';
import ModelExport from './ModelExport';
import TrainingConfig from './TrainingConfig';
import TrainingStatus from './TrainingStatus';

const TrainPage = () => {
  return (
    <TrainingInfoProvider>
      <TrainingConfig />
      <TrainingStatus />
      <ModelExport />
    </TrainingInfoProvider>
  );
};

export default TrainPage;
