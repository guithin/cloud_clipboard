import {
  createAction,
} from 'typesafe-actions';

import {
  Actions,
  AlertState,
  ConfirmState
} from './types';

const openAlert = createAction(Actions.ALERT_OPEN)<AlertState>();
const closeAlert = createAction(Actions.ALERT_CLOSE)<undefined>();

const openConfirm = createAction(Actions.CONFIRM_OPEN)<ConfirmState>();
const closeConfirm = createAction(Actions.CONFIRM_CLOSE)<void>();

export default {
  openAlert,
  closeAlert,
  openConfirm,
  closeConfirm
};
