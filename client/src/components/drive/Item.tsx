import React, { useCallback } from 'react';
import { TableRow, TableCell, Grid, Typography, Tooltip } from '@material-ui/core';
import { InsertDriveFile, Folder } from '@material-ui/icons';
import { ExplorerItem, nowFolder } from 'store/explorer/types';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import {
  getLink,
  getDownloadLink,
  getSizeString,
  getDateString,
  refContain
} from 'store/explorer/functions';
import { hrefFunc } from 'store/utils';
import { useHistory } from 'react-router-dom';
// import { useDispatch } from 'react-redux';

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
  onClick: Function,
  onRClick: Function,
  isLast: boolean,
  isSelect: boolean
}> = ({
  item,
  onClick,
  onRClick,
  isLast,
  isSelect
}) => {
  const classes = useStyles();
  const history = useHistory();
  // const dispatch = useDispatch();

  const handleRightClick = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    const clickedItem = (refContain(item.refDate, e.target) || refContain(item.refSize, e.target)) ? nowFolder : item;
    onRClick(e, clickedItem);
    // dispatch(actions.menuClose())
    // setTimeout((x, y) => {
    //   dispatch(actions.menuOpen({
    //     item,
    //     posX: x,
    //     posY: y
    //   }));
    // }, 200, e.pageX, e.pageY)
  }, [item, /*dispatch, */onRClick]);

  const handleDoubleClick = useCallback((e) => {
    if (item.isFile) {
      hrefFunc(getDownloadLink(item.name));
    }
    else {
      history.push(getLink(item.name));
    }
  }, [item, history]);

  return (
    <TableRow
      key={item.name}
      onClick={(e) => {
        onClick(e, item)
      }}
      onContextMenu={handleRightClick}
      onDoubleClick={handleDoubleClick}
      style={{
        backgroundColor:
          isLast && isSelect ? '#d8d8d8' :
          isSelect ? '#eee' : '#fff',
      }}
      ref={item.refItem}
    >
      <TableCell>
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
      <TableCell ref={item.refSize}>
        <Typography noWrap={true} className={classes.typoText}>
          {item.isFile ? getSizeString(item.meta.size) : ''}
        </Typography>
      </TableCell>
      <TableCell ref={item.refDate}>
        <Typography noWrap={true} className={classes.typoText}>
          {getDateString(item.meta.mtime)}
        </Typography>
      </TableCell>
    </TableRow>
  )
}

export default ItemFC;
