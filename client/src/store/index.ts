import { Store, createStore, compose, applyMiddleware } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import {
  createLogger,
} from 'redux-logger';

import { RootAction, RootState } from './types';
import rootReducer from './reducer';
import rootEpic from './epics';
import { setToken, assignAuther } from './utils';
import actions from './layout/actions';

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

let middlewares: any[] = [epicMiddleware];
middlewares.push(loggerMiddleware);
export const store = createStore(
  pReducer,
  composeEnhancers(applyMiddleware(...middlewares)),
);
epicMiddleware.run(rootEpic);
export const persistor = persistStore(store, undefined, persistHandler(store));

export const ConfirmCustom = ({ name, description }: { name: string, description: string }) => {
  return new Promise((resolve, reject) => {
    store.dispatch(actions.openConfirm({
      open: true,
      name, description, promise: { resolve, reject }
    }));
  });
}
