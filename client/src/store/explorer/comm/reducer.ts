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
          refresh: false
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
