export interface LayoutState {
  alert: AlertState,
}

export enum Actions {
  ALERT_OPEN = 'ALERT#OPEN',
  ALERT_CLOSE = 'ALERT#CLOSE'
}

export const initialAlertState: AlertState = {
  type: null,
  message: ''
}

export const initialState: LayoutState = {
  alert: initialAlertState
};

export interface AlertState {
  type: string | null,
  message: string,
}
