import { createReducer } from 'typesafe-actions';
import { ComState } from './types';
import comActions from './actions';

export const explorerCom = createReducer<ComState>({ read: {}, upload: {}, edit: {} })
  .handleAction(comActions.uploadRequest.request, (state, { payload }) => {
    return {
      ...state,
      upload: {
        ...state.upload,
        [payload.tagName]: {
          tagName: payload.tagName,
          uplaodRatio: 0,
          cancelToken: payload.cancelToken,
          refresh: false,
          filenames: payload.files.map(i => i.name)
        }
      }
    }
  })
  .handleAction(comActions.uploadRequest.success, (state, { payload }) => {
    return {
      ...state,
      upload: {
        ...state.upload,
        [payload.tagName]: payload
      }
    }
  })
  .handleAction(comActions.uploadRefresh, (state, { payload }) => {
    return {
      ...state,
      upload: {
        ...state.upload,
        [payload]: {
          ...state.upload[payload],
          refresh: true
        }
      }
    }
  })
  .handleAction(comActions.editRequest.request, (state, { payload }) => {
    return {
      ...state,
      edit: {
        ...state.edit,
        [payload.tagName]: {
          tagName: payload.tagName,
          refresh: false
        }
      }
    }
  })
  .handleAction(comActions.editRequest.success, (state, { payload }) => {
    return {
      ...state,
      edit: {
        ...state.edit,
        [payload.tagName]: payload
      }
    }
  })
  .handleAction(comActions.editRefresh, (state, { payload }) => {
    return {
      ...state,
      edit: {
        ...state.edit,
        [payload]: {
          ...state.edit[payload],
          refresh: true
        }
      }
    }
  })
  .handleAction(comActions.onUploadProgress, (state, { payload }) => {
    return {
      ...state,
      upload: {
        ...state.upload,
        [payload.tagName]: {
          ...state.upload[payload.tagName],
          uplaodRatio: payload.loaded / payload.total
        }
      }
    };
  })
  .handleAction(comActions.deleteUploadQuery, (state, { payload }) => {
    const newState = { ...state };
    for (let i in state.upload) {
      if (state.upload[i].cancelToken) {
        state.upload[i].cancelToken.cancel();
      }
    }
    newState.upload = {};
    return newState;
  })
