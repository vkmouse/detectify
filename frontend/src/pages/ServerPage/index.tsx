import { useMutation, useQueryClient } from '@tanstack/react-query';
import styled from 'styled-components';
import api from '../../api/api';
import { OutlinePrimaryButton } from '../../components/Button';
import { useServerInfo } from '../../context/ServerInfoContext';
import ServerCard from './ServerCard';
import PlusIcon from '../../assets/plus-circle.svg';
import { Loader } from '../../components/Loading';
import { Card } from '../../components/Card';
import Tutorial from './Tutorial';

const CardContainer = styled(Card)`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const Button = styled(OutlinePrimaryButton)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 150px;
`;

const ServerPage = () => {
  const {
    token,
    serverStatus,
    defaultServerStatus,
    reloadServerStatus,
    reloadDefaultServerStatus,
  } = useServerInfo();

  const queryClient = useQueryClient();
  const { mutate: handleCreateSpace, isLoading: isCreating } = useMutation({
    mutationFn: api.createServerSpace,
    onSuccess: () => queryClient.invalidateQueries(['serverStatus']),
  });
  const { mutate: handleRemoveSpace, isLoading: isRemoving } = useMutation({
    mutationFn: api.removeServerSpace,
    onSuccess: () => queryClient.invalidateQueries(['serverStatus']),
  });

  return (
    <>
      <ServerCard
        name="Default"
        status={defaultServerStatus}
        removeDisabled={true}
        onReloadClick={reloadDefaultServerStatus}
      />
      {isCreating || isRemoving ? (
        <CardContainer>
          <Loader />
        </CardContainer>
      ) : serverStatus !== 'Not Created' ? (
        <ServerCard
          name="Self"
          status={serverStatus}
          removeDisabled={isRemoving}
          token={token}
          onCopyClick={() => void 0}
          onRemoveClick={handleRemoveSpace}
          onReloadClick={reloadServerStatus}
        />
      ) : (
        <ButtonContainer>
          <Button disabled={isCreating} onClick={() => handleCreateSpace()}>
            <PlusIcon />
          </Button>
        </ButtonContainer>
      )}
      <Tutorial />
    </>
  );
};

export default ServerPage;
