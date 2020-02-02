import { combineEpics } from 'redux-observable';
import userEpic from './user/epics';
import explorerComEpic from './explorer/comm/epics';

const epics = [
  userEpic, explorerComEpic
];

const rootEpic = combineEpics(...epics);

export default rootEpic;
