import { request } from 'store/utils';
import { ReqReaddir, ReqUpload } from './types';

export const readdirApi = (info: ReqReaddir) => 
  request.post('/api/drive/readdir' + info.path, {
    token: info.token
  });

export const uploadItem = (info: ReqUpload) => {
  const sendFile = new FormData();
  for (let i in info.files) {
    sendFile.append('files#' + i, info.files[i]);
  }
  sendFile.append('token', info.token);
  return request.post('/api/drive/upload' + info.path, sendFile, {
    onUploadProgress: (e) => console.log(e)
  }).then(res => res.data);
}