import path from 'path';
import { serverHost, hrefFunc } from 'store/utils';
import { ExplorerState } from './content/types';
import { Dispatch } from 'react';
import H from 'history';
import contActions from './content/actions';
import commActions from './comm/actions';
import layoutActions from 'store/layout/actions';
import { ResUploadMap } from './comm/types';

// util functions
export const getDateString = (date: string): string => {
  if (!date) return '';
  const dd = new Date(date);
  return `${dd.getFullYear()}. ${dd.getMonth() + 1}. ${dd.getDate()}.`;
}

export const getSizeString = (size: number): string => {
  const lst = ['B', 'KB', 'MB', 'GB', 'TB'];
  let idx = 0;
  while (size / 1024 > 1) {
    size /= 1024;
    idx++;
  }
  return String(size.toFixed(2)) + lst[idx];
}

export const refContain = (refA: React.RefObject<HTMLInputElement> | null, refB: HTMLInputElement) => {
  return refA && refA.current && refA.current.contains(refB);
};

export const addressFormat = (clientAddress: string): string => {
  return path.join('/', ...clientAddress.split(path.sep).filter(i => i.length > 0 && i !== 'drive'));
}

export const convertPath = (realPath: string): string => path.join('/', ...realPath.split('/').filter(p => p.length > 0 && p !== 'drive'));

// explorer control functions
export type StateFuncParam = {
  main: ExplorerState,
  dispatch: Dispatch<any>,
  username: string,
  history: H.History<any>,
  upload: ResUploadMap
}

const beginFunc = ({ dispatch }: StateFuncParam) => {
  const query = new URLSearchParams(window.location.search);
  const token = query.get('token');
  if (token) {
    dispatch(contActions.setToken({
      tagName: 'main',
      token
    }));
  }
  const locatePath = convertPath(window.location.pathname);
  dispatch(commActions.readdirRequest.request({
    tagName: 'main',
    token: token || '',
    path: locatePath
  }))
}

const doneFunc = ({ main, dispatch, upload }: StateFuncParam) => {
  const locatePath = convertPath(window.location.pathname);
  if (path.relative(main.nowPath, locatePath)) {
    dispatch(commActions.readdirRequest.request({
      tagName: 'main',
      token: main.token,
      path: locatePath
    }));
    return;
  }

  // upload refresh
  let refresh = false;
  for (let i in upload) {
    if (upload[i].result && upload[i].refresh === false) {
      if (upload[i].result?.filepath === main.nowPath) {
        refresh = true;
      }
      dispatch(commActions.uploadRefresh(i));
    }
  }
  if (refresh) {
    dispatch(commActions.readdirRequest.request({
      tagName: 'main',
      token: main.token,
      path: main.nowPath
    }));
  }
}

const loadFunc = ({ dispatch }: StateFuncParam) => {
  dispatch(contActions.itemClear());
}

const errorFunc = ({ main, dispatch, username, history }: StateFuncParam) => {
  dispatch(layoutActions.openAlert({
    type: 'explorerConn',
    message: '디렉토리 조회에 실패했습니다.'
  }));
  if (main.rootPath) {
    history.push(path.join('/drive', main.rootPath));
  }
  else if (username) {
    history.push(path.join('/drive', username));
  }
  else {
    hrefFunc('/login');
  }
}
// 'begin' | 'loading' | 'success' | 'error'
export const functionMapper = {
  begin: beginFunc,
  loading: loadFunc,
  success: doneFunc,
  error: errorFunc
}
