import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button, 
  TextField,
  Paper,
} from '@material-ui/core';
import {
  createStyles, makeStyles, Theme,
} from '@material-ui/core/styles';
import { RegisterInfo } from 'store/user/types';
import userActions from 'store/user/actions';
import layoutActions from 'store/layout/actions';
import { RootState } from 'store/types';
import { idValidCheck, passwdValidCheck } from 'store/utils';

const selectUser = ({
  user: {
    err
  }
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
    top: '17%',
    width: '300px',
    height: '350px',
    textAlign: 'center',
  },
  loginGrid: {
    marginTop: '70px',
  }
}));

const Register: React.FC = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const { err } = useSelector(selectUser);

  const [pwdCheck, setPwdCheck] = useState('');

  const [registerInfo, setRegisterInfo] = useState<RegisterInfo>({
    username: '',
    password: ''
  });

  const handleChangePCT = useCallback(({ target: { value }}) => {
    setPwdCheck(value);
  }, []);

  const handleChange = useCallback(({ target: { name, value }}) => {
    setRegisterInfo({
      ...registerInfo,
      [name]: value
    });
  }, [registerInfo]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (!idValidCheck(registerInfo.username)) {
      dispatch(layoutActions.openAlert({
        type: 'register',
        message: 'id를 확인해주세요.'
      }));
      return;
    }
    if (!passwdValidCheck(registerInfo.password)) {
      dispatch(layoutActions.openAlert({
        type: 'register',
        message: '비밀번호를 확인해주세요.'
      }));
      return;
    }
    if (registerInfo.password !== pwdCheck) {
      dispatch(layoutActions.openAlert({
        type: 'register',
        message: '비밀번호가 다릅니다.'
      }));
      return;
    }
    dispatch(userActions.register.request(registerInfo));
  }, [dispatch, registerInfo, pwdCheck]);

  useEffect(() => {
    if (err && err.type === 'register') {
      dispatch(layoutActions.openAlert({
        type: 'register',
        message: err.message
      }));
      dispatch(userActions.loginErrRemove());
    }
  }, [err, dispatch])

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
              value={registerInfo.username}
              onChange={handleChange}
            />
            <br />
            <TextField
              name='password'
              id='password'
              label='pssword'
              type='password'
              value={registerInfo.password}
              onChange={handleChange}
            />
            <br />
            {React.cloneElement(
            <TextField
              name='passwordConfirm'
              id='passwordConfirm'
              label='passwordConfirm'
              type='password'
              value={pwdCheck}
              onChange={handleChangePCT}
            />, {
              error: pwdCheck !== registerInfo.password
            })}
            <br />
            <br />
            <Button
              type='submit'
              variant='contained'
              color='primary'
            >
              Register
            </Button>
          </form>
        </div>
      </Paper>
    </div>
  )
}

export default Register;