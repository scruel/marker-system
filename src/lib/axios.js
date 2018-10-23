import axios from 'axios';

import { domain } from '../config/env';

const instance = axios.create({
  baseURL: domain,
  timeout: 20000, // 设置超时时间
});

let timer;

instance.interceptors.request.use(
  /* eslint-disable */
  config => {
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      window.vm.$loading();
    }, 500);

    return config;
  },
  /* eslint-disable */
  /* eslint-disable */
  error => {
    if (timer) {
      clearTimeout(timer);
    }
    window.vm.$loading();
    return Promise.reject(error);
  },
  /* eslint-disable */
);

instance.interceptors.response.use(
  /* eslint-disable */
  response => {
    if (timer) {
      clearTimeout(timer);
    }
    window.vm.$loading.close();
    return response;
  },
  /* eslint-disable */
  /* eslint-disable */
  error => {
    if (timer) {
      clearTimeout(timer);
    }

    window.vm.$loading.close();
    return Promise.reject(error);
  },
  /* eslint-disable */
);

export default instance;
