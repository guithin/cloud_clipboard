import { createAsyncAction } from 'typesafe-actions';
import {
  ReqReaddir,
  ResReaddir,
  ReqUpload,
  ResUpload,
  ReqEdit,
  ResEdit
} from './types';

enum Actions {
  READDIR_REQUEST = 'COM_READDIR#REQUEST',
  READDIR_SUCCESS = 'COM_READDIR#SUCCESS',
  READDIR_FAILURE = 'COM_READDIR#FAILURE',

  UPLOADS_REQUEST = 'COM_UPLOADS#REQUEST',
  UPLOADS_SUCCESS = 'COM_UPLOADS#SUCCESS',
  UPLOADS_FAILURE = 'COM_UPLOADS#FAILURE',
  UPLOADS_CANCEL = 'COM_UPLOADS#CANCEL',

  EDITEMS_REQUEST = 'COM_EDITEMS#REQUEST',
  EDITEMS_SUCCESS = 'COM_EDITEMS#SUCCESS',
  EDITEMS_FAILURE = 'COM_EDITEMS#FAILURE',
  // EDITEMS_CANCEL = 'COM_EDITEMS#CANCEL',
}

const readdirRequest = createAsyncAction(
  Actions.READDIR_REQUEST,
  Actions.EDITEMS_SUCCESS,
  Actions.EDITEMS_FAILURE,
)<ReqReaddir, ResReaddir, void>();


const uploadRequest = createAsyncAction(
  Actions.UPLOADS_REQUEST,
  Actions.UPLOADS_SUCCESS,
  Actions.UPLOADS_FAILURE,
  Actions.UPLOADS_CANCEL
)<ReqUpload, ResUpload, void, void>();

const editRequest = createAsyncAction(
  Actions.EDITEMS_REQUEST,
  Actions.EDITEMS_SUCCESS,
  Actions.EDITEMS_FAILURE,
)<ReqEdit, ResEdit, void>();

export default {
  readdirRequest,
  uploadRequest,
  editRequest,
  Actions
}
