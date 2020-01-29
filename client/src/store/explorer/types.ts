import React from 'react';
// general action
export enum Actions {
  GET_EX_ITEM_REQUEST = 'GET_EX_ITEM#REQUEST',
  GET_EX_ITEM_SUCCESS = 'GET_EX_ITEM#SUCCESS',
  GET_EX_ITEM_FAILURE = 'GET_EX_ITEM#FAILURE',

  GET_EX_ITEM_DELETE = 'GET_EX_ITEM#DELETE',

  UPLOAD_ITEM_REQUEST = 'UPLOAD_ITEM#REQUEST',
  UPLOAD_ITEM_SUCCESS = 'UPLOAD_ITEM#SUCCESS',
  UPLOAD_ITEM_FAILURE = 'UPLOAD_ITEM#FAILURE',
  UPLOAD_ITEM_DONE = 'UPLOAD_ITEM#DONE',

  UPLOAD_ITEM_DELETE = 'UPLOAD_ITEM#DELETE',

  EDIT_ITEM_REQUEST = 'MKDIR_ITEM#REQUEST',
  EDIT_ITEM_SUCCESS = 'MKDIR_ITEM#SUCCESS',
  EDIT_ITEM_FAILURE = 'MKDIR_ITEM#FAILURE',
  EDIT_ITEM_EDLETE = 'MKDIR_ITEM#DELETE',

  ITEM_MENU_OPEN = 'ITEM_MENU#OPEN',
  ITEM_MENU_CLOSE = 'ITEM_MENU#CLOSE',

  UG_SET = 'UG#SET',
  UG_UNSET = 'UG#UNSET'
}

// explorer state
export interface FileMeta {
  size: number,
  atime: string,
  mtime: string,
  ctime: string,
  birthtime: string,
}

export interface ExplorerItem {
  name: string,
  isFile: boolean,
  meta: FileMeta,

  refItem: React.RefObject<HTMLInputElement> | null,
  refDate: React.RefObject<HTMLInputElement> | null,
  refSize: React.RefObject<HTMLInputElement> | null,
}

export const backFile = (): ExplorerItem => {
  return {
    name: '..',
    isFile: false,
    meta: {
      size: 0,
      atime: '',
      mtime: '',
      ctime: '',
      birthtime: ''
    },
    refItem: React.createRef(),
    refDate: React.createRef(),
    refSize: React.createRef(),
  }
}

export const nowFolder: ExplorerItem = {
  name: '.',
  isFile: false,
  meta: {
    size: 0,
    atime: '',
    mtime: '',
    ctime: '',
    birthtime: ''
  },
  refItem: null,
  refDate: null,
  refSize: null
}

export enum ExStatus {
  EX_BEGIN = 'EX_BEGIN',
  EX_SET_TOKEN = 'EX_SET_TOKEN',
  
  EX_LOADING = 'EX_LOADING',
  EX_DONE = 'EX_DONE',

  EX_ERROR = 'EX_ERROR',
}

export interface ExplorerState {
  status: ExStatus,
  rootPath: string,
  nowPath: string,
  token: string | null,
  items: ExplorerItem[],
  err: string | null
}

export const initState: ExplorerState = {
  status: ExStatus.EX_BEGIN,
  rootPath: '',
  nowPath: '',
  token: null,
  items: [] as ExplorerItem[],
  err: null
}

export type ItemSelect = {
  lst: Map<string, ExplorerItem>,
  lastItem: ExplorerItem | null
};
export const initItemSelect = (): ItemSelect => {
  return {
    lst: new Map<string, ExplorerItem>(),
    lastItem: null
  }
}

// communication with server
export interface ExResUPMap { [key: string]: ExResUP }
export interface ExResEdMap { [key: string]: ExResEd }

export interface ExConn {
  read?: ExResRD,
  upload?: ExResUPMap,
  edit?: ExResEdMap,
}

export const exconnInit: ExConn = {};

export interface ExReqRD {
  path: string,
  token: string
}

export interface ExResRD {
  status: 'begin' | 'loading' | 'success' | 'error',
  error?: string
  result?: {
    rootPath: string,
    files: ExplorerItem[],
  }
}

export interface ExReqUP {
  path: string,
  nowPath: string,
  token: string,
  payload: File[],
  timeTag: string,
}

export interface ExResUP {
  status: 'begin' | 'loading' | 'success' | 'error' | 'done',
  error?: string
  result?: {
    filepath: string,
    filename: string[],
  },
  timeTag: string
}

// rm, mkdir, mv, cp
export interface ExReqEd {
  type: 'rm' | 'mkdir' | 'cp' | 'mv',
  path: string,
  command: string,
  token: string,
  timeTag: string,
}

export interface ExResEd {
  status: 'begin' | 'loading' | 'success' | 'error' | 'done',
  error?: string,
  result?: {
    path: string,
    command: string,
  },
  timeTag: string
}

// explorer menu
export interface MenuState {
  open: boolean,
  item?: ExplorerItem[],
  posX?: number,
  posY?: number
}

//upload guide
export interface UGState {
  folder?: string
}

export const UGinit: UGState = {}