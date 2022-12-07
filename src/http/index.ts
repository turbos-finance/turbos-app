import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';

export type ResponseDataType = {
  code: number;
  messsage?: string;
  data?: any;
};

const http = axios.create({
  baseURL: process.env.REACT_APP_HTTP_URL,
  timeout: 10000,
});

// request
http.interceptors.request.use(
  (config: AxiosRequestConfig | any) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// respone
http.interceptors.response.use(
  (response: any) => {
    return response;
  },
  (error: any) => {
    return Promise.reject(error);
  },
);

export default http;
