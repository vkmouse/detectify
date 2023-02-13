import {
  APIResponse,
  BatchPublishRequest,
  BatchUploadRequest,
  BatchUploadResponse,
  GetServerStatusResponse,
  InferRequest,
  InferResponse,
  LoginRequest,
  ProjectInfoResponse,
  ProjectResponse,
  RegisterRequest,
  UserInfo,
} from '../types/api';
import {
  authAxios,
  inferAxios,
  normalAxios,
  removeToken,
  trainingAxios,
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
  getProject: async (projectId: string): Promise<ProjectInfoResponse> => {
    const response = await authAxios.get(`/project/${projectId}`);
    const { data } = await response.data;
    return data;
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

  // training api
  getServerStatus: async () => {
    const response = await trainingAxios.get('/server');
    return response.data.data as GetServerStatusResponse;
  },
  getDefaultServerStatus: async () => {
    const response = await trainingAxios.get('/server/default');
    return response.data.data as GetServerStatusResponse;
  },
  createServerSpace: async () => {
    const response = await trainingAxios.put('/server');
    return response.data.data as GetServerStatusResponse;
  },
  removeServerSpace: async () => {
    const response = await trainingAxios.delete('/server');
    return response.data.data as GetServerStatusResponse;
  },
  trainModel: async (data: {
    dataset: BatchUploadResponse[];
    labels: string[];
    batchSize: number;
    numSteps: number;
  }) => {
    const response = await trainingAxios.post('/model/train', {
      ...data,
      preTrainedModel: 'ssd_mobilenet_v2_fpnlite_320x320_coco17_tpu-8',
    });
    console.log(response.data);
  },
};

export default api;
