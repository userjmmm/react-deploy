import { QueryClient } from '@tanstack/react-query';
import type { AxiosInstance, AxiosRequestConfig } from 'axios';
import axios from 'axios';

let BASE_URL = localStorage.getItem('baseURL') || 'https://api.example.com';

const initInstance = (config: AxiosRequestConfig): AxiosInstance => {
  const instance = axios.create({
    timeout: 5000,
    ...config,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...config.headers,
    },
  });

  return instance;
};

export let fetchInstance = initInstance({
  baseURL: BASE_URL,
});

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnMount: true,
      refetchOnReconnect: true,
      refetchOnWindowFocus: true,
    },
  },
});

export const updateBaseUrl = (newBaseUrl: string) => {
  BASE_URL = newBaseUrl;
  localStorage.setItem('baseURL', newBaseUrl);
  fetchInstance = initInstance({
    baseURL: BASE_URL,
  });
  console.log('Updated fetchInstance:', fetchInstance.defaults.baseURL);
};

export const getBaseUrl = () => {
  return localStorage.getItem('baseURL') || 'https://api.example.com';
};