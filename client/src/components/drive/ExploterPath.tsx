import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import path from 'path';
import { List, Theme, ListItem, Typography, CircularProgress} from '@material-ui/core';
import { Link } from 'react-router-dom';
import { RootState } from 'store/types';
import { useSelector } from 'react-redux';

const selector = ({
  explorerCont: {
    main
  }
}: RootState) => ({
  main
});

const useStyles = makeStyles((theme: Theme) => ({
  pathView: {
    marginTop: '10px',
    display: 'flex',
    flexDirection: 'row',
    padding: 0,
  },
  pathPart: {
    maxWidth: '300px',
    marginTop: '0px'
  },
}));

const ExplorerPath: React.FC = () => {

  const classes = useStyles();
  const { main } = useSelector(selector);

  const getViewPath = () => {
    if (!main) return [];
    let tempPath = '/drive';
    return path.relative(path.join(main.rootPath, '..'), main.nowPath)
      .split('/')
      .map(pathP => {
        const part = decodeURIComponent(pathP);
        return {
          part,
          link: tempPath = path.join(tempPath, part)
        }
      });
  }

  return (
    <List className={classes.pathView}>
      {getViewPath().map(({ part, link }) => (
        <Link
          key={link}
          to={{
            pathname: link,
            search: window.location.search
          }}
          style={{ textDecoration: 'none' }}
        >
          <ListItem
            className={classes.pathPart}
            button
            key={part}
          >
            <Typography noWrap={true} color='textSecondary'>
              {part}
            </Typography>
          </ListItem>
        </Link>
      ))}
      {main.status !== 'success' && (<CircularProgress size={30} style={{ marginLeft: '15px' }}/>)}
    </List>
  )
}

export default ExplorerPath;
