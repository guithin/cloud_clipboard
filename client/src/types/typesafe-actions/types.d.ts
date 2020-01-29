import { StateType, ActionType } from 'typesafe-actions';

import { RootState, RootAction } from '../../store/types';

declare module 'typesafe-actions' {
  interface Types {
    RootState: RootState;
    RootAction: RootAction;
  }
}
