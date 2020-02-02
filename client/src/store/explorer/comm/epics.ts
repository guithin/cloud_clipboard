import { RootAction, RootState } from "store/types";
import { ActionType, isActionOf } from 'typesafe-actions';
import { Epic, combineEpics } from "redux-observable";
import { filter, mergeMap, map, catchError } from "rxjs/operators";
import actions from "./actions";
import { from } from "rxjs";
import { readdirApi } from "./api";

const exComEpic: Epic<
  RootAction,
  ActionType<typeof actions.readdirRequest.success> | ActionType<typeof actions.readdirRequest.failure>,
  RootState
> = (act) => act.pipe(
  filter(isActionOf(actions.readdirRequest.request)),
  mergeMap((act) => from(readdirApi(act.payload)).pipe(
    map((res) => actions.readdirRequest.success({
      result: res.data,
      tagName: act.payload.tagName
    })),
    catchError((err) => [actions.readdirRequest.failure()])
  ))
)

export default combineEpics(
  exComEpic
);