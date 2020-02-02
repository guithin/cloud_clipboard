import React, { useCallback, useRef, useEffect } from 'react';
import { TableRow, TableCell, Grid, Typography, Tooltip } from '@material-ui/core';
import { InsertDriveFile, Folder } from '@material-ui/icons';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import { ExplorerItem, nowFolder } from 'store/explorer/content/types';
import { useDispatch, useSelector } from 'react-redux';
import actions from 'store/explorer/content/actions';
import { RootState } from 'store/types';
import { hrefFunc } from 'store/utils';
import {
  getDateString,
  getSizeString,
  refContain,
  getDownloadLink,
  getLink
} from 'store/explorer/functions';

const selector = ({
  sltState
}: RootState) => ({
  sltState
});

const useStyles = makeStyles((theme: Theme) => createStyles({
  typoText: {
    fontSize: 15,
  },
  iconMargin: {
    marginRight: '20px'
  }
}));

const ItemFC: React.FC<{
  item: ExplorerItem,
}> = ({
  item,
}) => {
  const allRef = useRef<HTMLInputElement>(null);
  const itemRef = useRef<HTMLInputElement>(null);
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();

  const { sltState } = useSelector(selector);

  const handleRightClick = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    const clickedItem = refContain(itemRef, e.target) ? item : nowFolder;
    console.log(clickedItem);
  }, [item]);

  const handleDoubleClick = useCallback((e) => {
    if (item.isFile) {
      hrefFunc(getDownloadLink(item.name));
    }
    else {
      history.push({
        pathname: getLink(item.name),
        search: window.location.search
      });
    }
  }, [item, history]);

  const handleClick = useCallback((e) => {
    dispatch(actions.itemSelect({
      items: [item],
      mode: 'one'
    }));
  }, [dispatch, item]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (refContain(itemRef, e.target)) {
      if (item.isFile) {
        if (Object.keys(sltState.lst).length > 0) {
          dispatch(actions.itemClear());
        }
        return;
      }
      if (Object.keys(sltState.lst).length !== 1 || !sltState.lst[item.name]) {
        dispatch(actions.itemSelect({
          mode: 'one',
          type: 'drag',
          items: [item],
        }));
      }
    }
  }, [dispatch, item, sltState]);

  const colorState = useCallback((): string => {
    if (sltState.lst[item.name]) {
      if (sltState.lastItem && sltState.lastItem.name === item.name) {
        return '#d8d8d8';
      }
      else {
        return '#eee';
      }
    }
    return '#fff';
  }, [sltState, item]);

  useEffect(() => {
    document.addEventListener('dragover', handleDragOver);
    return () => {
      document.removeEventListener('dragover', handleDragOver);
    }
  }, [handleDragOver]);

  return (
    <TableRow
      key={item.name}
      onClick={handleClick}
      onContextMenu={handleRightClick}
      onDoubleClick={handleDoubleClick}
      style={{
        backgroundColor: colorState()
      }}
      ref={allRef}
    >
      <TableCell ref={itemRef}>
        <Grid container alignItems='center'>
          <Grid item className={classes.iconMargin}>
            {item.isFile ? (<InsertDriveFile />) : (<Folder />)}
          </Grid>
          <Grid item>
            <Tooltip title={item.name} placement='bottom-start' enterDelay={500}>
              <Typography noWrap={true} className={classes.typoText}>{item.name}</Typography>
            </Tooltip>
          </Grid>
        </Grid>
      </TableCell>
      <TableCell>
        <Typography noWrap={true} className={classes.typoText}>
          {item.isFile ? getSizeString(item.meta.size) : ''}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography noWrap={true} className={classes.typoText}>
          {getDateString(item.meta.mtime)}
        </Typography>
      </TableCell>
    </TableRow>
  )
}

export default ItemFC;
