import {
  APIResponse,
  BatchPublishRequest,
  BatchUploadRequest,
  BatchUploadResponse,
  InferRequest,
  InferResponse,
  LoginRequest,
  ProjectResponse,
  RegisterRequest,
  UserInfo,
} from '../types/api';
import {
  authAxios,
  inferAxios,
  normalAxios,
  removeToken,
  updateToken,
} from './axios';

export type Message = {
  content: string;
  imageURL: string;
};

const api = {
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

  // project image api
  createBatchUpload: async (
    props: BatchUploadRequest
  ): Promise<Map<string, BatchUploadResponse>> => {
    const response = await authAxios.post('/image/upload', props);
    const { data } = response.data as APIResponse;
    const body = data as BatchUploadResponse[];
    const dataMap = new Map<string, BatchUploadResponse>();

    for (const { filename, imageURL, annotationURL } of body) {
      const existingData = dataMap.get(filename);
      if (existingData) {
        dataMap.set(filename, {
          filename,
          imageURL: existingData.imageURL ? existingData.imageURL : imageURL,
          annotationURL: existingData.annotationURL
            ? existingData.annotationURL
            : annotationURL,
        });
      } else {
        dataMap.set(filename, {
          filename,
          imageURL,
          annotationURL,
        });
      }
    }

    return dataMap;
  },
  publishBatchUpload: async (props: BatchPublishRequest) => {
    await authAxios.put('/image/upload', props);
  },
  getProjectImages: async (
    projectId: string
  ): Promise<BatchUploadResponse[]> => {
    const response = await authAxios.get(`/images`, {
      params: { projectId },
    });
    return response.data.data as BatchUploadResponse[];
  },

  // inference api
  infer: async (props: InferRequest): Promise<InferResponse[]> => {
    const response = await inferAxios.post('/predict', props);
    return response.data as InferResponse[];
  },
};

export default api;
