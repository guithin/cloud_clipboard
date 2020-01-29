import { createReducer } from 'typesafe-actions';
import explorerActions from './actions';
import {
  ExConn, exconnInit, ExResRD, ExResUP, UGState, UGinit, MenuState, ExResEd
} from './types';

export const explorerConn = createReducer<ExConn>(exconnInit)
  .handleAction(explorerActions.getExplorerItems.success, (state, { payload }) => {
    return {
      ...state,
      read: payload
    }
  })
  .handleAction(explorerActions.getExplorerItems.request, (state, { payload }) => {
    const read: ExResRD = {
      status: 'loading',
    }
    return {
      ...state,
      read
    }
  })
  .handleAction(explorerActions.getExplorerItems.failure, (state, { payload }) => {
    return {
      ...state,
      read: payload
    }
  })
  .handleAction(explorerActions.deleteRDQuery, (state) => {
    return {
      ...state,
      read: undefined
    };
  })
  .handleAction(explorerActions.uploadItems.request, (state, { payload }) => {
    const nowUpload: ExResUP = {
      status: 'loading',
      result: {
        filepath: payload.path,
        filename: payload.payload.map(file => file.name)
      },
      timeTag: payload.timeTag
    }
    return {
      ...state,
      upload: {
        ...state.upload,
        [nowUpload.timeTag]: nowUpload
      }
    }
  })
  .handleAction(explorerActions.uploadItems.success, (state, { payload }) => {
    return {
      ...state,
      upload: {
        ...state.upload,
        [payload.timeTag]: payload
      }
    }
  })
  .handleAction(explorerActions.uploadItems.failure, (state, { payload }) => {
    return {
      ...state,
      upload: {
        ...state.upload,
        [payload.timeTag]: payload
      }
    }
  })
  .handleAction(explorerActions.doneUPQuery, (state, { payload }) => {
    let newState = { ...state };
    if(newState.upload && newState.upload[payload]) {
      newState.upload[payload].status = 'done';
    }
    return newState;
  })
  .handleAction(explorerActions.deleteUPQuery, (state) => {
    if (!state.upload) return state;
    let newState = { ...state };
    delete newState.upload;
    return newState;
  })
  .handleAction(explorerActions.editQuery.request, (state, { payload }) => {
    const nowEdit: ExResEd = {
      status: 'loading',
      result: {
        path: payload.path,
        command: payload.command
      },
      timeTag: payload.timeTag
    }
    return {
      ...state,
      edit: {
        ...state.edit,
        [payload.timeTag]: nowEdit
      }
    };
  })
  .handleAction(explorerActions.editQuery.success, (state, { payload }) => {
    return {
      ...state,
      edit: {
        ...state.edit,
        [payload.timeTag]: payload
      }
    };
  })
  .handleAction(explorerActions.editQuery.failure, (state, { payload }) => {
    return {
      ...state,
      edit: {
        ...state.edit,
        [payload.timeTag]: payload
      }
    };
  })
  .handleAction(explorerActions.deleteEdQuery, (state, { payload }) => {
    if (!state.edit) return state;
    let nowState = { ...state.edit };
    if (nowState[payload]) delete nowState[payload];
    return {
      ...state,
      edit: nowState
    };
  })

export const UploadGuide = createReducer<UGState>(UGinit)
  .handleAction(explorerActions.uploadGuideSet, (state, { payload }) => {
    return payload;
  })
  .handleAction(explorerActions.uploadGuideUnset, (state) => {
    return UGinit;
  })

export const MenuStatus = createReducer<MenuState>({ open: false })
  .handleAction(explorerActions.menuOpen, (state, { payload }) => {
    return payload;
  })
  .handleAction(explorerActions.menuClose, (state) => {
    return {
      ...state,
      open: false
    };
  })