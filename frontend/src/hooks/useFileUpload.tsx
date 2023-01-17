import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';

type Props = {
  presignedURL: string;
  file: File;
  updateProgress: (progress: number) => void;
};

const useFileUpload = () => {
  const mutation = useMutation<void, AxiosError, Props>(
    ({ presignedURL, file, updateProgress }) =>
      axios.put(presignedURL, file, {
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );

            updateProgress(progress);
          }
        },
      })
  );

  return { ...mutation };
};

export default useFileUpload;
