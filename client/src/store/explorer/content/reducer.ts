import { createReducer } from 'typesafe-actions';
import { ExplorerStateMap, ExplorerState, MenuState, menuInitState, SltState, sltInit } from './types';
import comActions from 'store/explorer/comm/actions';
import actions from './actions';

export const explorerCont = createReducer<ExplorerStateMap>({})
  .handleAction(actions.setToken, (state, { payload }) => {
    const newState: ExplorerState = {
      ...state[payload.tagName],
      token: payload.token
    }
    return {
      ...state,
      [payload.tagName]: newState
    }
  })
  .handleAction(actions.changeStatus, (state, { payload }) => {
    const newState: ExplorerState = {
      ...state[payload.tagName],
      status: payload.status
    };
    return {
      ...state,
      [payload.tagName]: newState
    }
  })
  .handleAction(comActions.readdirRequest.request, (state, { payload }) => {
    const newState: ExplorerState = {
      ...state[payload.tagName],
      status: 'loading',
      rootPath: '',
      nowPath: payload.path,
      items: [],
    }
    return {
      ...state,
      [payload.tagName]: newState
    };
  })
  .handleAction(comActions.readdirRequest.success, (state, { payload }) => {
    if (!payload.result) return state;
    const newState: ExplorerState = {
      ...state[payload.tagName],
      status: 'success',
      rootPath: payload.result.rootPath,
      items: payload.result.files,
    }
    return {
      ...state,
      [payload.tagName]: newState
    };
  })

export const menuState = createReducer<MenuState>(menuInitState)
  .handleAction(actions.menuOpen, (state, { payload }) => {
    return {
      open: true,
      ...payload
    };
  })
  .handleAction(actions.menuClose, state => menuInitState)

export const sltState = createReducer<SltState>(sltInit)
  .handleAction(actions.itemSelect, (state, { payload }) => {
    let mode = payload.mode;
    const type = payload.type || 'none';
    if (type === 'drag') {
      mode = 'click';
    }
    switch (mode) {
      case 'click':
      {
        const nowItem = payload.items[0];
        return {
          ...state,
          type,
          lastItem: nowItem,
          lst: {
            [nowItem.name]: nowItem
          }
        }
      }
      case 'ctrl':
      {
        const item = payload.items[0];
        if (!item) return state;
        let newState = {
          ...state,
          lst: { ...state.lst },
          type,
        }
        newState.lastItem = item;
        if (newState.lst[item.name]) delete newState.lst[item.name];
        else newState.lst[item.name] = item;
        return newState;
      }
      case 'shift':
      {
        let newState: SltState = {
          ...state,
          lst: {},
          type,
        };
        payload.items.map(i => newState.lst[i.name] = i);
        return newState;
      }
    }
  })
  .handleAction(actions.itemClear, state => sltInit)
  .handleAction(actions.chanceType, (state, { payload }) => {
    return {
      ...state,
      type: payload
    }
  })
  