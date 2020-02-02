import { combineReducers } from 'redux';

import { RootState } from './types';

import user from './user/reducer';
import layout from './layout/reducer';
import { explorerCom } from './explorer/comm/reducer';
import { explorerCont, menuState, sltState } from './explorer/content/reducer';


const rootReducer = combineReducers<RootState>({
  user, layout, explorerCom, explorerCont, menuState, sltState
});

export default rootReducer;