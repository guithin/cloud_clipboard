import { combineEpics } from 'redux-observable';
import userEpic from './user/epics';
import explorerEpic from './explorer/epics';

const epics = [
  userEpic, explorerEpic
];

const rootEpic = combineEpics(...epics);

export default rootEpic;
