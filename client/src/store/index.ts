import { Store, createStore, compose, applyMiddleware } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import { Persistor, persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import {
  createLogger,
} from 'redux-logger';

import { RootAction, RootState } from './types';
import rootReducer from './reducer';
import rootEpic from './epics';
import { setToken, assignAuther } from './utils';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user'],
};

const persistHandler = (store: Store<RootState>) => () => {
  const state = store.getState();
  if (state.user.token) {
    setToken(state.user.token);
  }
  assignAuther();
}

const pReducer = persistReducer(persistConfig, rootReducer);
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const epicMiddleware = createEpicMiddleware<RootAction, RootAction, RootState>();
const loggerMiddleware = createLogger();

export default (): [Store<RootState>, Persistor] => {
  let middlewares: any[] = [epicMiddleware];

  middlewares.push(loggerMiddleware);

  const store = createStore(
    pReducer,
    composeEnhancers(applyMiddleware(...middlewares)),
  );

  epicMiddleware.run(rootEpic);

  return [store, persistStore(store, undefined, persistHandler(store))];
}