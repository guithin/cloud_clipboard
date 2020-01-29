import React from 'react';
import { ExplorerItem } from 'store/explorer/types';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@material-ui/core';

const DeleteDialog: React.FC<{
  item: ExplorerItem[] | undefined,
  open: boolean,
  onClose: Function,
  confirm: Function
}> = ({
  item,
  open,
  onClose,
  confirm
}) => {
  return (
    <Dialog
      disableBackdropClick
      open={open && !!item}
      onClose={() => onClose()}
    >
      <DialogTitle>
        삭제
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {item && item.length} 개의 항목을 삭제하시겠습니까?
        </DialogContentText>
        <DialogContentText color='error'>
          폴더를 삭제하는 경우 하위 폴더/파일도 삭제됩니다.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={() => {
            confirm();
            onClose();
          }}
          color='primary'
        >
          삭제
        </Button>
        <Button onClick={() => onClose()} color='primary'>
          취소
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteDialog;
