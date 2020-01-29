import axios from 'axios';
import { useState } from 'react';

// axios.defaults.baseURL = 'http://127.0.0.1:3001/';

export let assignAuther: Function;

let isAuthed = false;

export let assignedAuth = new Promise((res, rej) => {
  assignAuther = res;
});

axios.interceptors.request.use(async (req) => {
  await assignedAuth;
  if (!req.headers.common.Authorization && isAuthed) {
    req.headers = axios.defaults.headers;
  }
  return req;
})

export const setToken = (token: string): void => {
  axios.defaults.headers.common = {
    Authorization: `token ${token}`,
  }
  isAuthed = true;
}

export const request = axios;

export const hrefFunc = (path: string): void => {
  if (path.startsWith('http')) {
    window.location.href = path;
  }
  else {
    window.location.pathname = path;
  }
}

export const idValidCheck = (username: string): boolean => {
  if (username.length < 1 || username.length > 16) {
    return false;
  }
  const reg = username.match('([a-z]|[A-Z])([a-z]|[A-Z]|[0-9])*');
  if (!reg || reg[0] !== username) {
    return false;
  }
  return true;
}

export const passwdValidCheck = (pw: string): boolean => {
  if (pw.length < 1 || pw.length > 20) {
    return false;
  }
  const reg = pw.match('([a-z]|[A-Z]|[0-9])*');
  if (!reg || reg[0] !== pw) {
    return false;
  }
  return true;
}

export const serverHost = 'http://localhost:3001';

export const useForceUpdate = () => {
  const [, setForceUpdate] = useState(0);
  return () => setForceUpdate(tValue => ++tValue);
}