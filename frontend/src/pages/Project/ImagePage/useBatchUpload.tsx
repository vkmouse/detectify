import axios, { AxiosProgressEvent } from 'axios';
import { useState } from 'react';
import { UploadProperty } from '../../../types/api';

const useUploadFiles = () => {
  const [isUploading, setIsUploading] = useState(false);

  const uploadFiles = ({
    data,
    onSuccess,
  }: {
    data: UploadProperty[];
    onSuccess?: () => void;
  }) => {
    setIsUploading(true);
    let count = 0;
    for (const { presignedURL, file, updateProgress } of data) {
      const onUploadProgress = (progressEvent: AxiosProgressEvent) => {
        if (progressEvent.total) {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          updateProgress(progress);
        }
      };
      axios.put(presignedURL, file, { onUploadProgress }).then(() => {
        count = count + 1;
        if (count === data.length) {
          setIsUploading(false);
          onSuccess?.();
        }
      });
    }
  };

  return { isUploading, uploadFiles };
};

const useBatchUpload = () => {
  const { isUploading, uploadFiles } = useUploadFiles();
  return { isUploading, uploadFiles };
};

export default useBatchUpload;
