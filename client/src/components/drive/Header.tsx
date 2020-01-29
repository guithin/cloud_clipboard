import React from 'react';
import {
  AppBar, Toolbar, Typography, Link, IconButton, Grid
} from '@material-ui/core';
import {
  createStyles, makeStyles, Theme,
} from '@material-ui/core/styles';
import Home from '@material-ui/icons/Home';
import Storage from '@material-ui/icons/Storage';

const useStyles = makeStyles((theme: Theme) => createStyles({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  icons: {
    marginLeft: 'auto'
  }
}))

const Header: React.FC = () => {
  const classes = useStyles();

  return (
    <AppBar
      position='fixed'
      className={classes.appBar}
    >
      <Toolbar>
        <Grid container spacing={2}>
          <Grid item>
            <Storage style={{ marginTop: '3px' }}/>
          </Grid>
          <Grid item>
            <Typography variant='h6' noWrap>
              Storage
            </Typography>
          </Grid>
        </Grid>
        <div className={classes.icons}>
          <Link href='/'>
            <IconButton>
              <Home style={{ color: '#fff' }}/>
            </IconButton>
          </Link>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
