import axios from '../lib/axios';

export const login = data =>
  axios({
    url: '/login.php',
    method: 'POST',
    data,
  });

export const subject = data =>
  axios({
    url: '/subject.php',
    method: 'POST',
    data,
  });

export const commit = data =>
  axios({
    url: '/commit.php',
    method: 'POST',
    data,
  });

export const mark = data =>
  axios({
    url: '/mark.php',
    method: 'POST',
    data,
  });
