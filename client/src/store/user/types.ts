import { ActionType } from 'typesafe-actions';

import actions from './actions';

export enum Actions {
  FETCH_SIGN_IN_REQUEST = 'FETCH_SIGN_IN#REQUEST',
  FETCH_SIGN_IN_SUCCESS = 'FETCH_SIGN_IN#SUCCESS',
  FETCH_SIGN_IN_FAILURE = 'FETCH_SIGN_IN#FAILURE',

  REGISTER_REQUEST = 'REGISTER#REQUEST',
  REGISTER_SUCCESS = 'REGISTER#SUCCESS',
  REGISTER_FAILURE = 'REGISTER#FAILURE',

  SIGN_OUT = 'SIGN_OUT',

  REMOVE_LOGIN_ERR = 'REMOVE_LOGIN_ERR',
}

export interface User {
  username: string,
  token: string,
  err: LoginFailInfo | undefined
}

export type UserAction = ActionType<typeof actions>;

export interface LoginInfo {
  username: string,
  password: string,
}

export interface LoginFailInfo {
  type: 'login' | 'register',
  message: string,
}

export interface RegisterInfo {
  username: string,
  password: string,
}

export const initState: User = {
  username: '',
  token: '',
  err: undefined
}
