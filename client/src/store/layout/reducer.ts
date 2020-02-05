import {
  createReducer,
} from 'typesafe-actions';

import {
  initialState,
  initialAlertState,
  initConfirmState
} from './types';
import layoutActions from './actions';

const alertReducer = createReducer(initialState)
  .handleAction(layoutActions.openAlert, (state, { payload }) => {
    return {
      ...state,
      alert: payload
    }
  })
  .handleAction(layoutActions.closeAlert, state => {
    return {
      ...state,
      alert: initialAlertState
    }
  })
  .handleAction(layoutActions.openConfirm, (state, { payload }) => {
    return {
      ...state,
      confirm: payload
    }
  })
  .handleAction(layoutActions.closeConfirm, state => {
    return {
      ...state,
      confirm: initConfirmState
    }
  })

export default alertReducer;
