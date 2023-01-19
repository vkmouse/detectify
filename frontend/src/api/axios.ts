import axios, { AxiosError, RawAxiosRequestHeaders } from 'axios';
import { APIResponse } from '../types/api';

const normalAxios = axios.create({
  baseURL: process.env.API_URL,
});
normalAxios.defaults.headers.common['retry'] = 1;

const authAxios = axios.create({
  baseURL: process.env.API_URL,
  headers: {
    Authorization: `Bearer ${window.localStorage.getItem('accessToken')}`,
  },
  withCredentials: true,
});
authAxios.defaults.headers.common['retry'] = 1;

const updateToken = (token: string) => {
  window.localStorage.setItem('accessToken', token);
  authAxios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

const removeToken = () => {
  window.localStorage.removeItem('accessToken');
  authAxios.defaults.headers.common['Authorization'] = '';
};

authAxios.interceptors.response.use(null, async (error: AxiosError) => {
  const { response } = error;
  if (response && response.status === 401) {
    const refreshResponse = await normalAxios.post(
      'user/auth/refresh',
      undefined,
      {
        withCredentials: true,
      }
    );
    const apiResponse: APIResponse = refreshResponse.data as APIResponse;
    const { accessToken } = apiResponse.data as { accessToken: string };
    updateToken(accessToken);

    const { config } = error;
    if (config && config.headers) {
      config.headers = config.headers as RawAxiosRequestHeaders;
      config.headers.Authorization = `Bearer ${accessToken}`;
      return axios(config);
    }
  }
});

export { normalAxios, authAxios, updateToken, removeToken };
