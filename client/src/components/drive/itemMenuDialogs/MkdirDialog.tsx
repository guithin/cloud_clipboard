import React, { useState } from 'react';
import { Dialog, DialogTitle, TextField, DialogContent, Button, DialogActions } from '@material-ui/core';

const MkdirDialog: React.FC<{
  open: boolean,
  onClose: Function,
  confirm: Function,
}> = ({
  open,
  onClose,
  confirm
}) => {
  const [state, setState] = useState('');
  return (
    <Dialog
      open={open}
      onClose={() => {
        setState('')
        onClose()
      }}
    >
      <DialogTitle>새 폴더</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          id='name'
          label='폴더 이름'
          value={state}
          onChange={({ target: { value }}) => setState(value)}
        />
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={() => {
            setState('');
            onClose();
            confirm(state);
          }}
          color='primary'
        >
          만들기
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

export default MkdirDialog;