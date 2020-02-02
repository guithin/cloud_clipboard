import { createReducer } from 'typesafe-actions';
import { ComState } from './types';

export const explorerCom = createReducer<ComState>({ read: {}, upload: {}, edit: {} })
