import { ExplorerItem } from "../content/types";

// readdir
export interface ReqReaddir {
  path: string,
  token: string,
  tagName: string,
}

export interface ResReaddir {
  error?: string,
  result?: {
    rootPath: string,
    files: ExplorerItem[]
  }
  tagName: string,
}

// upload item
export interface ReqUpload {
  path: string,
  token: string,
  files: File[],
  tagName: string
}

export interface ResUpload {
  loading: number,
  rootPath: string,
  nowPath: string,
  token: string,
  items: ExplorerItem[],
  tagName: string,
  error?: string,
}

// edit (rm, mkdir, mv, cp)
export interface ReqEdit {
  type: 'rm' | 'mkdir' | 'mv' | 'cp',
  path: string,
  command: string,
  token: string,
  tagName: string
}

export interface ResEdit {
  error?: string,
  result?: {
    path: string,
    command: string,
  }
  tagName: string,
}

// general
interface ResReaddirMap { [key: string]: ResReaddir }
interface ResUploadMap { [key: string]: ResUpload }
interface ResEditMap { [key: string]: ResEdit }

export interface ComState {
  read: ResReaddirMap,
  upload: ResUploadMap,
  edit: ResEditMap
}
