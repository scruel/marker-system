import axios from 'axios';

import { domain } from '../config/env';

const instance = axios.create({
  baseURL: domain,
  timeout: 20000, // 设置超时时间
});

let loading;
let timer;

instance.interceptors.request.use(
  config => {
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      window.vm.$loading();
    }, 500);

    return config;
  },

  error => {
    if (timer) {
      clearTimeout(timer);
    }
    window.vm.$loading();
    return Promise.reject(error);
  },
);

instance.interceptors.response.use(
  response => {
    if (timer) {
      clearTimeout(timer);
    }
    window.vm.$loading.close();
    return response;
  },

  error => {
    if (timer) {
      clearTimeout(timer);
    }

    window.vm.$loading.close();
    return Promise.reject(error);
  },
);

export default instance;
