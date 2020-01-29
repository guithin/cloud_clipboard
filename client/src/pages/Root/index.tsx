import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'store/types';
import { Link, List, ListItem, Paper, Typography, Grid, Button } from '@material-ui/core';
import { Storage, Warning } from '@material-ui/icons';
import {
  makeStyles,
  Theme
} from '@material-ui/core/styles';
import userActions from 'store/user/actions';
import path from 'path';

const selectUsername = ({
  user: {
    username,
  },
}: RootState) => ({
  username
});

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    position: 'fixed',
    width: '100%'
  },
  list: {
    justifyContent: 'center',
    display: 'flex',
  },
  paper: {
    width: '120px',
    height: '150px',
    marginTop: '100px',
    margin: theme.spacing(2, 2, 2, 2)
  },
  grid: {
    height: '100%',
    textAlign: 'center',
  },
  typography: {
    fontSize: 18
  },
  cmdBtnGird: {
    flexDirection: 'row-reverse',
    marginTop: '10px'
  },
  cmdBtn: {
    right: '40px'
  }
}));

const serviceItems = [{
    name: 'drive',
    link: '/drive',
    linkpath: [':username'],
    icon: <Storage />
  }, {
    name: 'test',
    link: '/test',
    icon: <Warning />
  }
];

const Main: React.FC = () => {
  const { username } = useSelector(selectUsername);

  const dispatch = useDispatch();
  const classes = useStyles();

  const getLink = (link: string, linkpath: string[] | undefined): string => {
    let ret = link;
    for (const i of linkpath || []) {
      switch (i) {
        case ':username':
          ret = path.join(ret, username);
          break;
        default:
          ret = path.join(ret, i);
          break;
      }
    }
    return ret;
  }

  const logout = useCallback((e) => {
    e.preventDefault();
    dispatch(userActions.logout())
  }, [dispatch])

  return (
    <div className={classes.root}>
      <Grid container className={classes.cmdBtnGird} spacing={2}>
        <Grid item>
          <Button variant='contained' className={classes.cmdBtn} onClick={logout}>
            logout
          </Button>
        </Grid>
      </Grid>
      <List className={classes.list}>
        {serviceItems.map((item) => (
          <Paper key={item.name} className={classes.paper}>
            <Link key={item.name} href={getLink(item.link, item.linkpath)} style={{ textDecoration: 'none' }}>
              <ListItem key={item.name} className={classes.grid} button>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    {React.cloneElement(item.icon, { style: { fontSize: 35 } })}
                  </Grid>
                  <Grid item xs={12}>
                  <Typography className={classes.typography} noWrap={true} color='textPrimary'>
                    {item.name}
                  </Typography>
                  </Grid>
                </Grid>
              </ListItem>
            </Link>
          </Paper>
        ))}
      </List>
    </div>
  );
}

export default Main;
