import { createAction, createAsyncAction } from 'typesafe-actions';

import {
  Actions,
  User,
  LoginInfo,
  RegisterInfo,
  LoginFailInfo
} from './types';

const logout = createAction(Actions.SIGN_OUT)<void>();

const login = createAsyncAction(
  Actions.FETCH_SIGN_IN_REQUEST,
  Actions.FETCH_SIGN_IN_SUCCESS,
  Actions.FETCH_SIGN_IN_FAILURE
)<LoginInfo, User, LoginFailInfo>();

const loginErrRemove = createAction(Actions.REMOVE_LOGIN_ERR)<void>();

const register = createAsyncAction(
  Actions.REGISTER_REQUEST,
  Actions.REGISTER_SUCCESS,
  Actions.REGISTER_FAILURE
)<RegisterInfo, User, LoginFailInfo>();

export default {
  login, logout, register, loginErrRemove
};