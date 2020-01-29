import React from 'react';
import {
  Drawer, List, ListItem, ListItemIcon, Typography
} from '@material-ui/core';
import {
  Storage
} from '@material-ui/icons';
import {
  createStyles, makeStyles, Theme,
} from '@material-ui/core/styles';
import { RootState } from 'store/types';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const selectUser = ({
  user: {
    username
  }
}: RootState) => ({
  username
});

const useStyles = makeStyles((theme: Theme) => createStyles({
  icon: {
    display: 'flex',
    alignItems: 'center',
    fontSize: 'default',
    padding: theme.spacing(2, 11),
  },
  drawer: {
    width: 240,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerPaper: {
    width: 240,
  },
  GridRoot: {
    height: '100%',
  },
  toolbar: {
    ...theme.mixins.toolbar
  }
}));

const Sidebar: React.FC = () => {
  const classes = useStyles();
  const { username } = useSelector(selectUser);

  return (
    <Drawer
      variant='permanent'
      className={classes.drawer}
      classes={{
        paper: classes.drawerPaper
      }}
    >
      <div className={classes.toolbar} />
      {!!username ? (
        <List>
          <Link
            to={'/drive/' + username}
            style={{ textDecoration: 'none' }}
          >
            <ListItem button key={'/drive/' + username}>
              <ListItemIcon><Storage /></ListItemIcon>
              <Typography noWrap={true} color='textPrimary'>
                내 드라이브
                </Typography>
            </ListItem>
          </Link>
        </List>
      ) : (
          <></>
        )}
    </Drawer>
  );
};

export default Sidebar;
