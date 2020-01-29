import { request } from '../utils';
import {
  LoginInfo,
  User,
  RegisterInfo
} from './types';

export const requestLogin = (loginInfo: LoginInfo) => 
  request.post('/api/account/login', loginInfo).then(({ data }: { data: User }) => data);

export const requestRegister = (registerInfo: RegisterInfo) => {
  return request.post('/api/account/register', registerInfo).then((res) => {
    return res.data;
  });
}

export const requestLogout = () =>
  request.post('/api/account/logout')