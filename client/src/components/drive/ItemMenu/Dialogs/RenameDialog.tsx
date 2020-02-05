import React, { useCallback, useState, useEffect } from 'react';
import { Dialog, DialogTitle, TextField, DialogContent, Button, DialogActions } from '@material-ui/core';
import { RootState } from 'store/types';
import { useSelector, useDispatch } from 'react-redux';
import contActions from 'store/explorer/content/actions';
import commActions from 'store/explorer/comm/actions';
import crypto from 'crypto';
import path from 'path';

const selector = ({
  explorerCont: { main },
  menuState,
  sltState
}: RootState) => ({
  main, menuState, sltState
});

const RenameDialog: React.FC = () => {

  const { main, menuState, sltState } = useSelector(selector);
  const dispatch = useDispatch();
  const [rename, setRename] = useState<string>('');

  const handleClose = useCallback(() => {
    dispatch(contActions.menuClose());
    setRename('');
  }, [dispatch]);

  const handleRename = useCallback(() => {
    dispatch(commActions.editRequest.request({
      type: 'mv',
      path: main.nowPath,
      command: JSON.stringify({
        item: Object.keys(sltState.lst)[0],
        movePath: path.join(main.nowPath, rename)
      }),
      token: main.token,
      tagName: crypto.createHash('sha256').update(main.nowPath + new Date().getTime().toString()).digest('base64')
    }));
    handleClose();
  }, [dispatch, main, rename, handleClose, sltState]);

  useEffect(() => {
    if (menuState.dialogState === 'rename') {
      setRename(Object.keys(sltState.lst)[0])
    }
  }, [sltState, menuState]);

  return (
    <Dialog
      open={menuState.dialogState === 'rename'}
      onClose={handleClose}
    >
      <DialogTitle>이름 바꾸기</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          id='name'
          label='폴더 이름'
          value={rename}
          onChange={({ target: { value }}) => setRename(value)}
        />
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={handleRename}
          color='primary'
        >
          바꾸기
        </Button>
        <Button 
          onClick={handleClose}
          color='primary'
        >
          취소
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default RenameDialog;