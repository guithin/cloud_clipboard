import { request } from '../utils';
import { ExReqRD, ExReqUP, ExReqEd } from './types';

export const getExplorerItems = (getInfo: ExReqRD) => {
  return request.post('/api/drive/readdir' + getInfo.path, {
    token: getInfo.token
  }).then(res => res.data);
}

export const uploadItem = (info: ExReqUP) => {
  const fileSend = new FormData();
  if (info.nowPath) {
    for (let i in info.payload) {
      fileSend.append(`files#${i}`, info.payload[i]);
    }
    fileSend.append('token', info.token);
    fileSend.append('origin', info.nowPath);
    fileSend.append('timeTag', info.timeTag);
  }
  return request.post('/api/drive/upload' + info.path, fileSend).then(res => res.data).catch(err => {
    throw new Error(JSON.stringify({
      timeTag: info.timeTag,
      filename: info.payload.map(i => i.name),
      filepath: info.path
    }));
  })
}

export const editQueryApi = (info: ExReqEd) => {
  return request.post('/api/drive/edit' + info.path, info).then(res => res.data).catch(err => {
    throw new Error(JSON.stringify({
      timeTag: info.timeTag,
      error: ''
    }))
  });
}
