export interface LayoutState {
  alert: AlertState,
  confirm: ConfirmState
}

export enum Actions {
  ALERT_OPEN = 'ALERT#OPEN',
  ALERT_CLOSE = 'ALERT#CLOSE',

  CONFIRM_OPEN = 'CONFIRM#OPEN',
  CONFIRM_CLOSE = 'CONFIRM#CLOSE'
}

export const initialAlertState: AlertState = {
  type: null,
  message: ''
}

export const initConfirmState: ConfirmState = {
  open: false,
  description: '',
  name: ''
}

export const initialState: LayoutState = {
  alert: initialAlertState,
  confirm: initConfirmState
};

export interface AlertState {
  type: string | null,
  message: string,
}


export interface ConfirmState {
  open: boolean,
  description: string,
  name: string,
  promise?: {
    resolve(): void,
    reject(): void
  }
}