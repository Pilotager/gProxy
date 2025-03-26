import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { apiConfig } from "./config";

const apiClient = axios.create({
  baseURL: apiConfig.baseUrl,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor (could be used for auth tokens later)
apiClient.interceptors.request.use(
  (config) => {
    // Add any request modifications here
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle error responses
    return Promise.reject(error);
  }
);

export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

export const fetchApi = async <T = any>(
  url: string,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  try {
    const response: AxiosResponse<ApiResponse<T>> = await apiClient.get(
      url,
      config
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const postApi = async <T = any>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  try {
    const response: AxiosResponse<ApiResponse<T>> = await apiClient.post(
      url,
      data,
      config
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default apiClient;
