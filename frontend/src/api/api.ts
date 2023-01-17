import axios from 'axios';

const API_URL = process.env.API_URL;

type CreateUploadResponse = {
  id: string;
  presignedURL: string;
};

export type Message = {
  content: string;
  imageURL: string;
};

const api = {
  createUpload: async (): Promise<CreateUploadResponse> => {
    const response = await axios.post(`${API_URL}/image/upload`);
    const body: { data: CreateUploadResponse } = response.data;
    return body.data;
  },
};

export default api;
