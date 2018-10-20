import axios from 'axios';

import { domain } from '../config/env';

const instance = axios.create({
  baseURL: domain,
  timeout: 20000, // 设置超时时间
});

let loading;
let timer;

instance.interceptors.request.use(
  config => config,

  error => Promise.reject(error),
);

instance.interceptors.response.use(
  response => response,

  error => Promise.reject(error),
);

export default instance;
