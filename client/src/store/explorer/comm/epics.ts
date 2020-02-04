import { RootAction, RootState } from "store/types";
import { ActionType, isActionOf } from 'typesafe-actions';
import { Epic, combineEpics } from "redux-observable";
import { filter, mergeMap, map, catchError } from "rxjs/operators";
import actions from "./actions";
import { from } from "rxjs";
import { readdirApi, uploadItem, editItemApi } from "./api";

const exComEpic: Epic<
  RootAction,
  ActionType<typeof actions.readdirRequest.success> | ActionType<typeof actions.readdirRequest.failure>,
  RootState
> = (act) => act.pipe(
  filter(isActionOf(actions.readdirRequest.request)),
  mergeMap(act => from(readdirApi(act.payload)).pipe(
    map(res => actions.readdirRequest.success({
      result: res.data,
      tagName: act.payload.tagName
    })),
    catchError((err) => [actions.readdirRequest.failure()])
  ))
)

const exComUpload: Epic<
  RootAction,
  ActionType<typeof actions.uploadRequest.success> | ActionType<typeof actions.uploadRequest.failure>,
  RootState
> = (act) => act.pipe(
  filter(isActionOf(actions.uploadRequest.request)),
  mergeMap(act => from(uploadItem(act.payload)).pipe(
    map(res => actions.uploadRequest.success({
      result: res.data,
      tagName: act.payload.tagName,
      uplaodRatio: 1,
      refresh: false,
      cancelToken: act.payload.cancelToken,
      filenames: act.payload.files.map(i => i.name)
    })),
    catchError(err => [actions.uploadRequest.failure()])
  ))
)

const exComEdit: Epic<
  RootAction,
  ActionType<typeof actions.editRequest.success> | ActionType<typeof actions.editRequest.failure>,
  RootState
> = (act) => act.pipe(
  filter(isActionOf(actions.editRequest.request)),
  mergeMap(act => from(editItemApi(act.payload)).pipe(
    map(res => actions.editRequest.success({
      result: res.data,
      tagName: act.payload.tagName,
      refresh: false,
    })),
    catchError(err => [actions.editRequest.failure()])
  ))
)

export default combineEpics(
  exComEpic, exComUpload, exComEdit
);