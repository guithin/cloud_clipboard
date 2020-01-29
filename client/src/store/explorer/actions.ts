import { createAsyncAction, createAction } from 'typesafe-actions';

import {
  Actions,
  ExReqRD,
  ExReqUP,
  ExResRD,
  ExResUP,
  UGState,
  MenuState,
  ExReqEd,
  ExResEd,
} from './types';

const getExplorerItems = createAsyncAction(
  Actions.GET_EX_ITEM_REQUEST,
  Actions.GET_EX_ITEM_SUCCESS,
  Actions.GET_EX_ITEM_FAILURE
)<ExReqRD, ExResRD, ExResRD>();

const deleteRDQuery = createAction(Actions.GET_EX_ITEM_DELETE)<void>();

const uploadItems = createAsyncAction(
  Actions.UPLOAD_ITEM_REQUEST,
  Actions.UPLOAD_ITEM_SUCCESS,
  Actions.UPLOAD_ITEM_FAILURE
)<ExReqUP, ExResUP, ExResUP>();

const deleteUPQuery = createAction(Actions.UPLOAD_ITEM_DELETE)<void>();
const doneUPQuery = createAction(Actions.UPLOAD_ITEM_DONE)<string>();

const editQuery = createAsyncAction(
  Actions.EDIT_ITEM_REQUEST,
  Actions.EDIT_ITEM_SUCCESS,
  Actions.EDIT_ITEM_FAILURE,
  Actions.EDIT_ITEM_EDLETE
)<ExReqEd, ExResEd, ExResEd, undefined>();

const deleteEdQuery = createAction(Actions.EDIT_ITEM_EDLETE)<string>();

const uploadGuideSet = createAction(Actions.UG_SET)<UGState>();
const uploadGuideUnset = createAction(Actions.UG_UNSET)<void>();

const menuOpen = createAction(Actions.ITEM_MENU_OPEN)<MenuState>();
const menuClose = createAction(Actions.ITEM_MENU_CLOSE)<void>();

export default {
  getExplorerItems,
  deleteRDQuery,
  uploadItems,
  deleteUPQuery,
  doneUPQuery,
  uploadGuideSet,
  uploadGuideUnset,
  deleteEdQuery,
  menuOpen,
  menuClose,
  editQuery
};