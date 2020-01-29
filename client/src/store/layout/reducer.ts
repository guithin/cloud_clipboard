import {
  createReducer,
} from 'typesafe-actions';

import {
  initialState,
  initialAlertState
} from './types';
import layoutActions from './actions';

const alertReducer = createReducer(initialState)
  .handleAction(layoutActions.openAlert, (state, action) => {
    return {
      ...state,
      alert: action.payload
    }
  })
  .handleAction(layoutActions.closeAlert, (state) => {
    return {
      ...state,
      alert: initialAlertState
    }
  })

export default alertReducer;
