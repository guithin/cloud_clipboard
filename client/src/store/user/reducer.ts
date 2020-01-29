import { createReducer } from 'typesafe-actions';
import userActions from './actions';
import { initState } from './types';
import { setToken } from 'store/utils';
import { requestLogout } from './api';

const user = createReducer(initState)
  .handleAction(userActions.logout, () => {
    requestLogout();
    return initState;
  })
  .handleAction(userActions.login.success, (state, { payload }) => {
    setToken(payload.token);
    return payload;
  })
  .handleAction(userActions.login.failure, (state, { payload }) => {
    return {
      ...initState,
      err: {
        type: 'login',
        message: `로그인에 실패했습니다. (${payload.message})`
      }
    };
  })
  .handleAction(userActions.register.success, (state, { payload }) => {
    setToken(payload.token);
    return payload;
  })
  .handleAction(userActions.register.failure, (state, { payload }) => {
    return {
      ...initState,
      err: {
        type: 'register',
        message: `가입에 실패했습니다. (${payload.message})`
      }
    };
  })
  .handleAction(userActions.loginErrRemove, (state) => {
    return initState;
  })

export default user;
