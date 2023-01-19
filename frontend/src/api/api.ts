import axios from 'axios';
import { LoginRequest, RegisterRequest } from '../types/api';

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

  // auth api
  register: async (props: RegisterRequest) => {
    await axios.post(`${API_URL}/user`, props);
  },
  login: async (props: LoginRequest) => {
    return await axios.put(`${API_URL}/user/auth`, props);
  },
};

export default api;
