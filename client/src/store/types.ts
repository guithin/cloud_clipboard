import { User } from './user/types';
import { LayoutState } from './layout/types';
import { ExConn, UGState, MenuState } from './explorer/types';
import { ActionType } from 'typesafe-actions';

import userAction from './user/actions';
import layoutAction from './layout/actions';
import explorerAction from './explorer/actions';

export interface RootState {
  user: User,
  layout: LayoutState,
  explorerConn: ExConn,
  UploadGuide: UGState,
  MenuStatus: MenuState
}

export type RootAction = 
ActionType<typeof userAction> |
ActionType<typeof layoutAction> |
ActionType<typeof explorerAction>;