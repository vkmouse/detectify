import {
  APIResponse,
  BatchPublishRequest,
  BatchUploadRequest,
  BatchUploadResponse,
  ServerStatusResponse,
  InferResponse,
  LoginRequest,
  ProjectInfoResponse,
  ProjectResponse,
  RegisterRequest,
  UserInfo,
  TrainingStatusResponse,
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
  removeProject: async (projectId: string): Promise<boolean> => {
    const response = await authAxios.delete(`/project/${projectId}`);
    return 200 <= response.status && response.status < 300;
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
    const response = await authAxios.get('/images', {
      params: { projectId },
    });
    return response.data.data as BatchUploadResponse[];
  },
  removeProjectImage: async (
    projectId: string,
    filename: string
  ): Promise<boolean> => {
    const response = await authAxios.delete('/images', {
      params: { projectId, filename },
    });
    return 200 <= response.status && response.status < 300;
  },

  // inference api
  createInferRequest: async (modelURL: string): Promise<string> => {
    const response = await inferAxios.post('/predict', { modelURL });
    return response.data.data.requestId as string;
  },
  inferWithURL: async (
    requestId: string,
    imageURL: string
  ): Promise<boolean> => {
    const response = await inferAxios.post(`/predict/${requestId}`, {
      imageURL,
    });
    return response.status === 202;
  },
  inferWithImage: async (requestId: string, image: File): Promise<boolean> => {
    const formData = new FormData();
    formData.append('image', image);
    const response = await inferAxios.post(`/predict/${requestId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.status === 202;
  },
  getInferResult: async (
    requestId: string
  ): Promise<{ status: string; results: InferResponse[] }> => {
    const response = await inferAxios.get(`/predict/${requestId}`);
    return response.data.data as { status: string; results: InferResponse[] };
  },

  // training api
  getServerAlive: async () => {
    const response = await trainingAxios.get('/server');
    return response.data.data as ServerStatusResponse;
  },
  getDefaultServerAlive: async () => {
    const response = await trainingAxios.get('/server/default');
    return response.data.data as ServerStatusResponse;
  },
  createServerSpace: async () => {
    const response = await trainingAxios.put('/server');
    return response.data.data as ServerStatusResponse;
  },
  removeServerSpace: async () => {
    const response = await trainingAxios.delete('/server');
    return response.data.data as ServerStatusResponse;
  },
  getTrainingStatus: async () => {
    const response = await trainingAxios.get('/model/train');
    return response.data.data as TrainingStatusResponse;
  },
  trainModel: async (data: {
    projectId: string;
    dataset: BatchUploadResponse[];
    pretrainedModelURL: string;
    batchSize: number;
    numSteps: number;
    learningRateBase: number;
    warmupLearningRate: number;
    warmupSteps: number;
  }) => {
    const response = await trainingAxios.post('/model/train', data);
    return response.data;
  },
};

export default api;
