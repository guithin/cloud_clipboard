import React, { useCallback } from 'react';
import { RootState } from 'store/types';
import { useSelector, useDispatch } from 'react-redux';
import { Snackbar, SnackbarContent, IconButton } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import actions from 'store/layout/actions';

const selectAlert = ({
  layout: {
    alert
  }
}: RootState) => ({
  alert
});

const AlertFC: React.FC = () => {
  const { alert } = useSelector(selectAlert);
  const dispatch = useDispatch();

  const handleClose = useCallback(() => {
    dispatch(actions.closeAlert());
  }, [dispatch])

  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      open={!!alert.type}
      autoHideDuration={3000}
      onClose={handleClose}
    >
      <SnackbarContent
        aria-describedby='client-snackbar'
        message={(
          <span id='client-snackbar'>
            {alert.message}
          </span>
        )}
        action={[
          <IconButton key='close' aria-label='close' color='inherit' onClick={handleClose}>
            <Close />
          </IconButton>,
        ]}
      />
    </Snackbar>
  );
};

export default AlertFC;
