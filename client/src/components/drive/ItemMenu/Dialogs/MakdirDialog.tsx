import React, { useCallback, useState } from 'react';
import { Dialog, DialogTitle, TextField, DialogContent, Button, DialogActions } from '@material-ui/core';
import { RootState } from 'store/types';
import { useSelector, useDispatch } from 'react-redux';
import contActions from 'store/explorer/content/actions';
import commActions from 'store/explorer/comm/actions';
import crypto from 'crypto';

const selector = ({
  explorerCont: { main },
  menuState
}: RootState) => ({
  main, menuState
});

const MakdirDialog: React.FC = () => {

  const { main, menuState } = useSelector(selector);
  const dispatch = useDispatch();
  const [dirName, setDirName] = useState<string>('');

  const handleClose = useCallback(() => {
    dispatch(contActions.menuDialog('none'));
    setDirName('');
  }, [dispatch]);

  const handleMkdir = useCallback(() => {
    dispatch(commActions.editRequest.request({
      type: 'mkdir',
      path: main.nowPath,
      command: dirName,
      token: main.token,
      tagName: crypto.createHash('sha256').update(main.nowPath + new Date().getTime().toString()).digest('base64')
    }));
    handleClose();
  }, [dispatch, main, dirName, handleClose]);

  return (
    <Dialog
      disableBackdropClick
      open={menuState.dialogState === 'mkdir'}
      onClose={handleClose}
    >
      <DialogTitle>새 폴더</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          id='name'
          label='폴더 이름'
          value={dirName}
          onChange={({ target: { value }}) => setDirName(value)}
        />
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={handleMkdir}
          color='primary'
        >
          만들기
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

export default MakdirDialog;