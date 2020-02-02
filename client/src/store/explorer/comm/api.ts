import { request } from 'store/utils';
import { ReqReaddir } from './types';

export const readdirApi = (info: ReqReaddir) => 
  request.post('/api/drive/readdir' + info.path, {
    token: info.token
  });