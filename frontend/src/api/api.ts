import {
  APIResponse,
  LoginRequest,
  ProjectResponse,
  RegisterRequest,
  UserInfo,
} from '../types/api';
import { authAxios, normalAxios, removeToken, updateToken } from './axios';

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
    const response = await normalAxios.post(`/image/upload`);
    const body: { data: CreateUploadResponse } = response.data;
    return body.data;
  },

  // auth api
  register: async (props: RegisterRequest) => {
    await normalAxios.post(`/user`, props);
  },
  login: async (props: LoginRequest): Promise<APIResponse> => {
    const response = await normalAxios.put(`/user/auth`, props, {
      withCredentials: true,
    });
    const { accessToken } = response.data.data as { accessToken: string };
    updateToken(accessToken);
    return response.data as APIResponse;
  },
  logout: async () => {
    await normalAxios.delete(`/user/auth`, {
      withCredentials: true,
    });
    removeToken();
  },
  getUserInfo: async (): Promise<UserInfo | null> => {
    try {
      const response = await authAxios.get(`/user/auth`);
      const { data } = await response.data;
      return data;
    } catch {
      return null;
    }
  },

  // project api
  getProjects: async (): Promise<ProjectResponse[]> => {
    const response = await authAxios.get('/projects');
    const { data } = await response.data;
    return data;
  },
  addProject: async (props: { name: string }) => {
    await authAxios.post('/project', props);
  },
};

export default api;
