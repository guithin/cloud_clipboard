import { from } from 'rxjs';
import {
  map,
  mergeMap,
  catchError,
  filter,
} from 'rxjs/operators';
import { Epic, combineEpics } from 'redux-observable';
import { ActionType, isActionOf } from 'typesafe-actions';

import { RootState, RootAction } from '../types';
import actions from './actions';
import { requestLogin, requestRegister } from './api';

const loginEpic: Epic<
  RootAction,
  ActionType<typeof actions.login.success> | ActionType<typeof actions.login.failure>,
  RootState
> = (act) => act.pipe(
  filter(isActionOf(actions.login.request)),
  mergeMap((act) => from(requestLogin(act.payload)).pipe(
    map((data) => actions.login.success(data)),
    catchError((err) => [actions.login.failure(err.response.data)])
  )),
);

const registerEpic: Epic<
  RootAction,
  ActionType<typeof actions.register.success> | ActionType<typeof actions.register.failure>,
  RootState
> = (act) => act.pipe(
  filter(isActionOf(actions.register.request)),
  mergeMap((act) => from(requestRegister(act.payload)).pipe(
    map((data) => actions.register.success(data)),
    catchError((err) => [actions.register.failure(err.response.data)])
  )),
);

export default combineEpics(
  loginEpic, registerEpic
);
