import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  createStyles, makeStyles, Theme,
} from '@material-ui/core/styles';
import {
  Button,
  TextField,
  Paper,
} from '@material-ui/core';
import { LoginInfo } from 'store/user/types';
import userActions from 'store/user/actions';
import { RootState } from 'store/types';
import layoutActions from 'store/layout/actions';
import { idValidCheck, passwdValidCheck } from 'store/utils';

const selectUser = ({
  user: { err }
}: RootState) => ({
  err
});

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    width: '100%',
    justifyContent: 'center',
    display: 'flex',
  },
  paper: {
    position: 'fixed',
    top: '20%',
    width: '300px',
    height: '300px',
    textAlign: 'center',
  },
  loginGrid: {
    marginTop: '80px',
  }
}));

const Login: React.FC = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const { err } = useSelector(selectUser);
  
  const [loginInfo, setLoginInfo] = useState<LoginInfo>({
    username: '',
    password: ''
  });

  const handleChange = useCallback(({ target: { name, value } }) => {
    setLoginInfo({
      ...loginInfo,
      [name]: value
    });
  }, [loginInfo]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (!idValidCheck(loginInfo.username)) {
      dispatch(layoutActions.openAlert({
        type: 'login',
        message: 'id를 확인해주세요.'
      }));
      return;
    }
    if (!passwdValidCheck(loginInfo.password)) {
      dispatch(layoutActions.openAlert({
        type: 'login',
        message: '비밀번호를 확인해주세요.'
      }));
      return;
    }
    dispatch(userActions.login.request(loginInfo));
  }, [dispatch, loginInfo]);

  useEffect(() => {
    if (err && err.type === 'login') {
      dispatch(layoutActions.openAlert({
        type: 'login',
        message: err.message
      }));
      dispatch(userActions.loginErrRemove());
    }
  }, [err, dispatch]);

  return (
    <div className={classes.root}>
      <Paper elevation={3} className={classes.paper}>
        <div className={classes.loginGrid}>
          <form
            onSubmit={handleSubmit}
          >
            <TextField
              name='username'
              id='username'
              label='id'
              value={loginInfo.username}
              onChange={handleChange}
            />
            <br />
            <TextField
              name='password'
              id='password'
              label='pssword'
              type='password'
              value={loginInfo.password}
              onChange={handleChange}
            />
            <br />
            <br />
            <Button
              type='submit'
              variant='contained'
              color='primary'
            >
              Login
          </Button>
          </form>
        </div>
      </Paper>
    </div>
  )
}

export default Login;