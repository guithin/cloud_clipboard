
export interface Content {
  type: 'text' | 'image' | 'file',
  payload: string,
  time: string,
  action?: Function
}