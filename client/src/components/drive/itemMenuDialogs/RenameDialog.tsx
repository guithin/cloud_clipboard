import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@material-ui/core';
import { ExplorerItem } from 'store/explorer/types';

const RenameDialog: React.FC<{
  item: ExplorerItem | undefined,
  open: boolean,
  onClose: Function,
  confirm: Function
}> = ({
  item,
  open,
  onClose,
  confirm
}) => {
  const [state, setState] = useState('');

  useEffect(() => {
    if (item) setState(item.name);
  }, [item]);

  return (
    <Dialog
      open={open}
      onClose={() => {
        setState('');
        onClose();
      }}
    >
      <DialogTitle>
        이름 바꾸기
      </DialogTitle>
      <DialogContent>
        <TextField
          id='name'
          label='이름'
          value={state}
          onChange={({ target: { value } }) => setState(value)}
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setState('');
            confirm(state);
            onClose();
          }}
          color='primary'
        >
          바꾸기
        </Button>
        <Button
          onClick={() => {
            setState('');
            onClose();
          }}
          color='primary'
        >
          취소
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default RenameDialog;
