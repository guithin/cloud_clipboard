import { combineReducers } from 'redux';

import { RootState } from './types';

import user from './user/reducer';
import layout from './layout/reducer';
import { explorerConn, UploadGuide, MenuStatus } from './explorer/reducer';

const rootReducer = combineReducers<RootState>({
  user, layout, explorerConn, UploadGuide, MenuStatus
});

export default rootReducer;