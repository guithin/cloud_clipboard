import React, { useCallback } from 'react';
import { RootState } from 'store/types';
import { useSelector, useDispatch } from 'react-redux';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@material-ui/core';
import actions from 'store/layout/actions';

const selector = ({
  layout: {
    confirm
  }
}: RootState) => ({
  confirm
});


const Confirm: React.FC = () => {

  const { confirm } = useSelector(selector);
  const dispatch = useDispatch();

  const handleClose = useCallback(() => {
    dispatch(actions.closeConfirm());
  }, [dispatch]);

  const handleReject = useCallback(() => {
    if (confirm.promise) {
      confirm.promise.reject();
    }
    handleClose();
  }, [confirm, handleClose]);

  const handleResolve = useCallback(() => {
    if (confirm.promise) {
      confirm.promise.resolve();
    }
    handleClose();
  }, [confirm, handleClose]);

  return (
    <Dialog
      disableBackdropClick
      open={confirm.open}
      onClose={handleClose}
    >
      <DialogTitle>
        {confirm.name}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {confirm.description}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleResolve}>
          확인
        </Button>
        <Button onClick={handleReject}>
          취소
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default Confirm;
