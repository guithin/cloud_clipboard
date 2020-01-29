import {
  createAction,
} from 'typesafe-actions';

import {
  Actions,
  AlertState
} from './types';

const openAlert = createAction(Actions.ALERT_OPEN)<AlertState>();
const closeAlert = createAction(Actions.ALERT_CLOSE)<undefined>();

export default {
  openAlert,
  closeAlert
};
