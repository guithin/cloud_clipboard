import { createAction } from 'typesafe-actions';
import { ExplorerStatus, SltOpts, DialogState } from './types'

enum Actions {
  SETTOKEN = 'SETTOKEN',
  CHAGESTATUS = 'CHANGESTATUS',

  MENU_OPEN = 'MENU#OPEN',
  MENU_CLOSE = 'MENU#CLOSE',

  MENU_DIALOG = 'MENU_DIALOG',

  ITEMSLT_SELECT = 'ITEMSLT#SELECT',
  ITEMSLT_CLEAR = 'ITEMSLT#CLEAR',
  ITEMSLT_CHANGE = 'ITEMSLT#CHANGE',

  UPLOADPOPUP_SET = 'UPLOADPOPUP#SET',
  UPLOADPOPUP_UNSET = 'UPLOADPOPUP#INSET'
}

const setToken = createAction(Actions.SETTOKEN)<{ tagName: string, token: string }>();
const changeStatus = createAction(Actions.CHAGESTATUS)<{ tagName: string, status: ExplorerStatus}>();

const menuOpen = createAction(Actions.MENU_OPEN)<{ posX: number, posY: number}>();
const menuClose = createAction(Actions.MENU_CLOSE)<void>();
const menuDialog = createAction(Actions.MENU_DIALOG)<DialogState>();

const itemSelect = createAction(Actions.ITEMSLT_SELECT)<SltOpts>();
const itemClear = createAction(Actions.ITEMSLT_CLEAR)<void>();

const chanceType = createAction(Actions.ITEMSLT_CHANGE)<'none' | 'drag'>();

const uploadPopupSet = createAction(Actions.UPLOADPOPUP_SET)<string>();
const uploadPopupUnset = createAction(Actions.UPLOADPOPUP_UNSET)<void>();

export default {
  setToken,
  changeStatus,
  menuOpen,
  menuClose,
  menuDialog,
  itemSelect,
  itemClear,
  chanceType,
  uploadPopupSet,
  uploadPopupUnset
}