import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import api from '../../api/api';
import { PrimaryButton } from '../../components/Button';
import ServerCard from './ServerCard';

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

const Button = styled(PrimaryButton)`
  width: 150px;
`;

const ServerPage = () => {
  const [defaultServerStatus, setDefaultServerStatus] = useState('Pending');
  const [serverStatus, setServerStatus] = useState('Not Created');
  const queryClient = useQueryClient();
  const { mutate: handleCreateSpace, isLoading: isCreating } = useMutation({
    mutationFn: api.createServerSpace,
    onSuccess: () => queryClient.invalidateQueries(['serverStatus']),
  });
  const { mutate: handleRemoveSpace, isLoading: isRemoving } = useMutation({
    mutationFn: api.removeServerSpace,
    onSuccess: () => queryClient.invalidateQueries(['serverStatus']),
  });

  useQuery({
    queryKey: ['serverStatus'],
    queryFn: api.getServerStatus,
    onSuccess: (data) => setServerStatus(data.status),
  });

  useEffect(() => {
    api.getDefaultServerStatus().then((data) => {
      setDefaultServerStatus(data.status);
    });
  }, []);

  return (
    <>
      <ServerCard
        name="Default"
        status={defaultServerStatus}
        removeDisabled={true}
      />
      {serverStatus !== 'Not Created' && (
        <ServerCard
          name="Self"
          status={serverStatus}
          removeDisabled={isRemoving}
          onRemoveClick={() => handleRemoveSpace()}
        />
      )}
      <ButtonContainer>
        <Button disabled={isCreating} onClick={() => handleCreateSpace()}>
          {isCreating ? 'Loading' : 'Create Space'}
        </Button>
      </ButtonContainer>
    </>
  );
};

export default ServerPage;
