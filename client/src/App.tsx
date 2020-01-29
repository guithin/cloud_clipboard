import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from 'store/types';
import Login from 'pages/Root/Login';
import Main from 'pages/Root';
import Register from 'pages/Root/Register';
import Test from 'pages/Root/test';
import DriveMain from 'pages/Drive'
import AlertFC from 'components/Alert';

const selector = ({
  user: {
    username,
  },
}: RootState) => ({
  isAuth: !!username,
});

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
  }),
);

const App: React.FC = () => {
  const classes = useStyles();
  const { isAuth } = useSelector(selector);

  return (
    <>
      <div className={classes.root}>
        <Router>
          {isAuth ? (
            <Switch>
              <Route path='/' exact component={Main} />
              <Route path='/drive' exact component={DriveMain} />
              <Route path='/drive/*' exact component={DriveMain} />
              <Route path='/test' exact component={Test} />
              <Redirect to='/' />
            </Switch>
          ) : (
            <Switch>
              <Route path='/login' exact component={Login} />
              <Route path='/register' exact component={Register} />

              <Route path='/drive' exact component={DriveMain} />
              <Route path='/drive/*' exact component={DriveMain} />
              
              <Redirect to='/login' />
            </Switch>
          )}
        </Router>
        <AlertFC />
      </div>
    </>
  );
};

export default App;
