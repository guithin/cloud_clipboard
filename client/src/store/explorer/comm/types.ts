import { ExplorerItem } from "../content/types";
import { CancelTokenSource } from 'axios';

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
  tagName: string,
  cancelToken: CancelTokenSource,
  onProgress(e: ProgressEvent): void
}

export interface ResUpload {
  error?: string,
  result?: {
    filepath: string,
  }
  tagName: string,

  filenames: string[],
  uplaodRatio: number,
  refresh: boolean,
  cancelToken: CancelTokenSource
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
  refresh: boolean,
  tagName: string,
}

// general
export interface ResReaddirMap { [key: string]: ResReaddir }
export interface ResUploadMap { [key: string]: ResUpload }
export interface ResEditMap { [key: string]: ResEdit }

export interface ComState {
  read: ResReaddirMap,
  upload: ResUploadMap,
  edit: ResEditMap
}
