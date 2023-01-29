import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import api from '../../../../api/api';
import { BatchUploadResponse } from '../../../../types/api';

const useProjectImages = (projectId: string) => {
  const [images, setImages] = useState<BatchUploadResponse[]>([]);

  const query = useQuery({
    queryKey: ['projectImages'],
    queryFn: async () => {
      return await api.getProjectImages(projectId);
    },
    onSuccess: (data) => {
      setImages(data);
    },
  });

  return { ...query, images };
};

export default useProjectImages;
