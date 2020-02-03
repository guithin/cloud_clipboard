// explorer main
interface FileMeta {
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
}

export interface ExplorerStateMap { [key: string]: ExplorerState }

export type ExplorerStatus = 'begin' | 'loading' | 'success' | 'error';
export interface ExplorerState {
  status: ExplorerStatus,
  rootPath: string,
  nowPath: string,
  token: string,
  items: ExplorerItem[],
  error?: string
}

export const explorerInit: ExplorerState = {
  status: 'begin',
  rootPath: '',
  nowPath: '',
  token: '',
  items: [] as ExplorerItem[],
}

export const backFolder: ExplorerItem = {
  name: '..',
  isFile: false,
  meta: {
    size: 0,
    atime: '',
    mtime: '',
    ctime: '',
    birthtime: ''
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
  }
}

// upload guide state
export interface UGState {
  folder?: string
}

// explorer select item state
export interface ItemMap { [key: string]: ExplorerItem }
export interface SltState {
  lst: ItemMap,
  lastItem?: ExplorerItem,
  type: 'none' | 'drag'
}

export const sltInit: SltState = {
  lst: {},
  type: 'none'
}

export interface SltOpts {
  items: ExplorerItem[],
  mode: 'click' | 'ctrl' | 'shift',
  type?: 'none' | 'drag',
  click?: ExplorerItem,
}

// explorer menu state
export interface MenuState {
  open: boolean,
  posX: number,
  posY: number
}

export const menuInitState: MenuState = {
  open: false,
  posX: 0,
  posY: 0
}