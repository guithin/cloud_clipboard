import React, { useCallback } from 'react';
import { Dialog, DialogTitle, DialogContentText, DialogContent, DialogActions, Button } from '@material-ui/core';
import { RootState } from 'store/types';
import { useSelector, useDispatch } from 'react-redux';
import contActions from 'store/explorer/content/actions';
import commActions from 'store/explorer/comm/actions';
import crypto from 'crypto';

const selector = ({
  menuState,
  sltState,
  explorerCont: { main }
}: RootState) => ({
  menuState,
  sltState,
  main
});

const DeleteDialog: React.FC = () => {

  const { menuState, sltState, main } = useSelector(selector);
  const dispatch = useDispatch();

  const handleClose = useCallback(() => {
    dispatch(contActions.menuClose());
  }, [dispatch]);
  
  const handleDelete = useCallback(() => {
    const itemNames = Object.keys(sltState.lst);
    if (itemNames.length < 1) return;
    dispatch(commActions.editRequest.request({
      type: 'rm',
      path: main.nowPath,
      command: JSON.stringify(itemNames),
      token: main.token,
      tagName: crypto.createHash('sha256').update(main.nowPath + new Date().getTime().toString()).digest('base64')
    }));
    dispatch(contActions.menuClose());
  }, [sltState, dispatch, main]);

  return (
    <Dialog
      disableBackdropClick
      open={menuState.dialogState === 'delete'}
      onClose={handleClose}
    >
      <DialogTitle>
        삭제
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {Object.keys(sltState.lst).length} 개의 항목을 삭제하시겠습니까?
        </DialogContentText>
        <DialogContentText color='error'>
          폴더를 삭제하는 경우 하위 폴더/파일도 삭제됩니다.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleDelete}
        >
          삭제
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

export default DeleteDialog;
