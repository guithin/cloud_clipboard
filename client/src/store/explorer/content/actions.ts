import { createAction } from 'typesafe-actions';
import { ExplorerStatus, SltOpts } from './types'

enum Actions {
  SETTOKEN = 'SETTOKEN',
  CHAGESTATUS = 'CHANGESTATUS',

  MENU_OPEN = 'MENU#OPEN',
  MENU_CLOSE = 'MENU#CLOSE',

  ITEMSLT_SELECT = 'ITEMSLT#SELECT',
  ITEMSLT_CLEAR = 'ITEMSLT#CLEAR',
  ITEMSLT_CHANGE = 'ITEMSLT#CHANGE'
}

const setToken = createAction(Actions.SETTOKEN)<{ tagName: string, token: string }>();
const changeStatus = createAction(Actions.CHAGESTATUS)<{ tagName: string, status: ExplorerStatus}>();

const menuOpen = createAction(Actions.MENU_OPEN)<{ posX: number, posY: number}>();
const menuClose = createAction(Actions.MENU_CLOSE)<void>();

const itemSelect = createAction(Actions.ITEMSLT_SELECT)<SltOpts>();
const itemClear = createAction(Actions.ITEMSLT_CLEAR)<void>();

const chanceType = createAction(Actions.ITEMSLT_CHANGE)<'none' | 'drag'>();

export default {
  setToken,
  changeStatus,
  menuOpen,
  menuClose,
  itemSelect,
  itemClear,
  chanceType
}