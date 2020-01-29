import { Epic, combineEpics } from "redux-observable";
import { RootAction, RootState } from "store/types";
import { ActionType, isActionOf } from 'typesafe-actions';
import actions from "store/explorer/actions";
import { filter, mergeMap, map, catchError } from "rxjs/operators";
import { from } from "rxjs";
import { getExplorerItems, uploadItem, editQueryApi } from "./api";

const explorerEpic: Epic<
  RootAction,
  ActionType<typeof actions.getExplorerItems.success> | ActionType<typeof actions.getExplorerItems.failure>,
  RootState
> = (act) => {
  return act.pipe(
    filter(isActionOf(actions.getExplorerItems.request)),
    mergeMap((act) => from(getExplorerItems(act.payload)).pipe(
      map((data) => actions.getExplorerItems.success({
        status: 'success',
        result: {
          rootPath: data.rootPath,
          files: data.files
        }
      })),
      catchError((err) => [actions.getExplorerItems.failure({
        status: 'error',
        error: JSON.stringify(err.response.data),
      })])
    )),
  );
}

const uploadEpic: Epic<
  RootAction,
  ActionType<typeof actions.uploadItems.success> | ActionType<typeof actions.uploadItems.failure>,
  RootState
> = (act) => {
  return act.pipe(
    filter(isActionOf(actions.uploadItems.request)),
    mergeMap((act) => from(uploadItem(act.payload)).pipe(
      map((data) => actions.uploadItems.success({
        status: 'success',
        result: {
          filepath: data.filepath,
          filename: data.filename
        },
        timeTag: data.timeTag
      })),
      catchError((err) => {
        const errObj = JSON.parse(err.message);
        return [
          actions.uploadItems.failure({
            status: 'error',
            error: errObj,
            result: {
              filename: errObj.filename,
              filepath: errObj.filepath
            },
            timeTag: errObj.timeTag
          })
        ]
      })
    )),
  )
}

const editEpic: Epic<
  RootAction,
  ActionType<typeof actions.editQuery.success> | ActionType<typeof actions.editQuery.failure>,
  RootState
> = (act) => {
  return act.pipe(
    filter(isActionOf(actions.editQuery.request)),
    mergeMap((act) => from(editQueryApi(act.payload)).pipe(
      map((data) => actions.editQuery.success({
        status: 'success',
        result: {
          path: data.path,
          command: data.command
        },
        timeTag: data.timeTag
      })),
      catchError(err => {
        const errObj = JSON.parse(err.message);
        return [
          actions.editQuery.failure({
            status: 'error',
            error: errObj,
            timeTag: errObj.timeTag
          })
        ]
      })
    ))
  )
}

export default combineEpics(
  explorerEpic,
  uploadEpic,
  editEpic
);
