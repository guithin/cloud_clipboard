import { Dispatch, SetStateAction } from "react";
import { ExplorerItem, ItemSelect, ExplorerState, ExStatus, ExConn, backFile } from "./types";
import path from 'path';
import { serverHost, hrefFunc } from "store/utils";
import actions from "./actions";
import layoutActions from 'store/layout/actions';
import H from 'history';
import React from "react";

export const clearSltState = (state: ItemSelect, forceUpdate: Function) => {
  if (state.lst.size) {
    state.lst.clear();
    forceUpdate();
  }
}

const setSltState_Ctrl = (state: ItemSelect, item: ExplorerItem): ItemSelect => {
  if (state.lst.has(item.name)) {
    state.lst.delete(item.name);
    if (state.lastItem && state.lastItem.name === item.name) {
      state.lastItem = null;
    }
  }
  else {
    state.lst.set(item.name, item);
    state.lastItem = item;
  }
  return state;
}

const setSltState_Shift = (state: ItemSelect, item: ExplorerItem, items: ExplorerItem[]): ItemSelect => {
  if (state.lst.has(item.name) || state.lastItem === null) {
    return state;
  }
  let toggle: boolean = false;
  for (let i of items) {
    if (toggle) {
      state.lst.set(i.name, i);
    }
    if (state.lastItem.name === i.name || item.name === i.name) {
      toggle = !toggle;
      state.lst.set(i.name, i);
    }
  }
  state.lastItem = item;
  return state;
}

export const setSltState = (type: 'ctrl' | 'shift' | 'click', state: ItemSelect, item: ExplorerItem, items: ExplorerItem[] = []): ItemSelect  => {
  if (type === 'ctrl') {
    return setSltState_Ctrl(state, item);
  }
  else if (type === 'shift') {
    return setSltState_Shift(state, item, items);
  }
  else {
    state.lst.clear();
    state.lst.set(item.name, item);
    state.lastItem = item;
  }
  return state;
}

export const convertPath = (realPath: string): string => path.join('/', ...realPath.split('/').filter(p => p.length > 0 && p !== 'drive'));
export const getLink = (item: string): string => path.join(window.location.pathname, item);
export const getDownloadLink = (item: string): string => serverHost + path.join('/api/drive/download', convertPath(getLink(item)));
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
  return String(size.toFixed(0)) + lst[idx];
}

export type StateFuncParam = {
  state: ExplorerState,
  setState: Dispatch<SetStateAction<ExplorerState>>
  dispatch: Dispatch<any>,
  explorerConn: ExConn,
  username: string,
  history: H.History<any>,
  sltItem: ItemSelect
}

const doneFunc = ({ state, setState, dispatch, explorerConn }: StateFuncParam) => {
  if (path.relative(state.nowPath, window.location.pathname)) {
    setState({
      ...state,
      status: ExStatus.EX_LOADING,
      nowPath: window.location.pathname
    });
    dispatch(actions.getExplorerItems.request({
      path: convertPath(window.location.pathname),
      token: state.token || ''
    }));
  }
  let refresh = false;
  for (let i in explorerConn.upload) {
    const now = explorerConn.upload[i];
    if (!now.result) continue;
    if (now.status === 'success') {
      if (path.relative(now.result.filepath, convertPath(state.nowPath)) === '') refresh = true;
      dispatch(actions.doneUPQuery(i));
    }
  }
  for (let i in explorerConn.edit) {
    const now = explorerConn.edit[i];
    if (!now.result) continue;
    if (now.status === 'success') {
      if (path.relative(now.result.path, convertPath(state.nowPath)) === '') refresh = true;
      dispatch(actions.deleteEdQuery(i));
    }
  }
  if (refresh) {
    setState({
      ...state,
      status: ExStatus.EX_LOADING
    });
    dispatch(actions.getExplorerItems.request({
      path: convertPath(state.nowPath),
      token: state.token || ''
    }));
  }
}

const beginFunc = ({ state, setState }: StateFuncParam) => {
  const query = new URLSearchParams(window.location.search);
  const token = query.get('token');
  if (token) {
    setState({
      ...state,
      token: token || '',
      status: ExStatus.EX_SET_TOKEN
    });
  }
  else {
    setState({
      ...state,
      status: ExStatus.EX_DONE
    });
  }
}

const setTokenFunc = ({ state, setState }: StateFuncParam) => {
  if (state.token) {
    setState({
      ...state,
      status: ExStatus.EX_DONE
    });
  }
}

const loadFunc = ({ state, setState, explorerConn, sltItem, dispatch }: StateFuncParam) => {
  if (explorerConn.read) {
    if (explorerConn.read.status === 'success') {
      if (!explorerConn.read.result) return;
      let items = explorerConn.read.result.files.map(file => {
        file.refItem = React.createRef();
        file.refDate = React.createRef();
        file.refSize = React.createRef();
        return file;
      });
      console.log(explorerConn.read.result.rootPath)
      if (path.relative(path.join('/drive', explorerConn.read.result.rootPath), state.nowPath)) {
        items.unshift(backFile());
      }
      sltItem.lst.clear();
      sltItem.lastItem = null;
      setState({
        ...state,
        status: ExStatus.EX_DONE,
        rootPath: explorerConn.read.result.rootPath,
        items,
      });
    }
    else if (explorerConn.read.status === 'error') {
      setState({
        ...state,
        status: ExStatus.EX_ERROR,
        err: explorerConn.read.error || ''
      })
    }
    else {
      return;
    }
    dispatch(actions.deleteRDQuery());
  }
}

const errorFunc = ({ state, setState, dispatch, username, history }: StateFuncParam) => {
  dispatch(layoutActions.openAlert({
    type: 'explorerConn',
    message: state.err || ''
  }));
  setState({
    ...state,
    items: [],
    status: ExStatus.EX_DONE
  });
  if (state.rootPath) {
    history.push(path.join('/drive', state.rootPath));
  }
  else if (username) {
    history.push(path.join('/drive', username));
  }
  else {
    hrefFunc('/login');
  }
}

export const functionMapper = {
  [ExStatus.EX_DONE]: doneFunc,
  [ExStatus.EX_BEGIN]: beginFunc,
  [ExStatus.EX_LOADING]: loadFunc,
  [ExStatus.EX_SET_TOKEN]: setTokenFunc,
  [ExStatus.EX_ERROR]: errorFunc
}

export const refContain = (refA: React.RefObject<HTMLInputElement> | null, refB: HTMLInputElement) => {
  return refA && refA.current && refA.current.contains(refB);
};