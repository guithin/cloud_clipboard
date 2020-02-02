import { ActionType } from 'typesafe-actions';
import { User } from './user/types';
import { LayoutState } from './layout/types';
import { ComState } from './explorer/comm/types';
import { ExplorerStateMap, MenuState, SltState } from './explorer/content/types';

import userAction from './user/actions';
import layoutAction from './layout/actions';
import exComAction from './explorer/comm/actions';
import exContAction from './explorer/content/actions';

export interface RootState {
  user: User,
  layout: LayoutState,
  explorerCom: ComState,
  explorerCont: ExplorerStateMap,
  menuState: MenuState,
  sltState: SltState
}

export type RootAction = 
ActionType<typeof userAction> |
ActionType<typeof layoutAction> |
ActionType<typeof exComAction> |
ActionType<typeof exContAction>;
