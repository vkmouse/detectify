import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import api from '../../../../api/api';

const useProjectImages = (projectId: string) => {
  const [images, setImages] = useState<string[]>([]);

  const query = useQuery({
    queryKey: ['projectImages'],
    queryFn: async () => {
      return await api.getProjectImages(projectId);
    },
    onSuccess: (data) => {
      setImages(data.map((p) => p.imageURL));
      console.log(data.length);
    },
  });

  return { ...query, images };
};

export default useProjectImages;
