import React, { Dispatch } from 'react';
import { MenuItem } from '@material-ui/core';
import actions from 'store/explorer/content/actions';
import { DialogState } from 'store/explorer/content/types';

const OpenDialog = (
  dispatch: Dispatch<any>,
  key: DialogState,
  displayString: string
): JSX.Element => {
  return (
    <MenuItem
      onClick={() => dispatch(actions.menuDialog(key))}
      key={key}
    >
      {displayString}
    </MenuItem>
  )
}

export default OpenDialog;
