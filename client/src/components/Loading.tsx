import React from 'react';
import { CircularProgress } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) => createStyles({
  loading: {
    position: 'fixed',
    top: '20%',
  },
  paper: {
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 10000,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    textAlign: 'center',
  }
}));

const Loading: React.FC = () => {
  
  const classes = useStyles();

  return (
    <div className={classes.paper}>
      <CircularProgress className={classes.loading} />
    </div>
  )
}

export default Loading;
