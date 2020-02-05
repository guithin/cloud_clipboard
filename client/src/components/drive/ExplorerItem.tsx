import React, { useCallback, useRef, useEffect } from 'react';
import { TableRow, TableCell, Grid, Typography, Tooltip } from '@material-ui/core';
import { InsertDriveFile, Folder, Image, Description } from '@material-ui/icons';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import { ExplorerItem, SltOpts, nowFolder } from 'store/explorer/content/types';
import { useDispatch, useSelector } from 'react-redux';
import actions from 'store/explorer/content/actions';
import { RootState } from 'store/types';
import { hrefFunc, serverHost } from 'store/utils';
import path from 'path';
import {
  getDateString,
  getSizeString,
  refContain,
} from 'store/explorer/functions';

const selector = ({
  sltState,
  explorerCont: {
    main
  }
}: RootState) => ({
  sltState,
  main
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

  const { sltState, main } = useSelector(selector);

  const handleRightClick = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (refContain(itemRef, e.target)) {
      if (!sltState.lst[item.name]) {
        dispatch(actions.itemSelect({
          mode: 'click',
          items: [item]
        }))
      }
    }
    else {
      dispatch(actions.itemClear());
    }
    dispatch(actions.menuOpen({
      posX: e.pageX,
      posY: e.pageY
    }))
  }, [sltState, item, dispatch]);

  const handleDoubleClick = useCallback((e) => {
    if (item.isFile) {
      hrefFunc(serverHost + path.join('/api/drive/download', main.nowPath, item.name));
    }
    else {
      const searchParamObj = new URLSearchParams();
      if (main.token) {
        searchParamObj.set('token', main.token);
      }
      history.push({
        pathname: path.join('/drive', main.nowPath, item.name),
        search: searchParamObj.toString()
      });
    }
  }, [item, history, main]);

  const handleClick = useCallback((e) => {
    const items = [] as ExplorerItem[];
    let mode: SltOpts["mode"] = 'click';
    if (e.shiftKey) {
      if (!sltState.lastItem) return;
      let toggle = false;
      for (let i of main.items) {
        if (i.name === item.name || i.name === sltState.lastItem.name) {
          toggle = !toggle;
          items.push(i);
        }
        if (toggle) {
          items.push(i);
        }
      }
      mode = 'shift';
    }
    else {
      items.push(item);
      if (e.ctrlKey) mode = 'ctrl';
    }
    dispatch(actions.itemSelect({
      items,
      mode
    }));
  }, [dispatch, item, main, sltState]);

  const itemDragSlt = useCallback((opt: ExplorerItem) => {
    const nowItem = opt;
    if (Object.keys(sltState.lst).length !== 1 || !sltState.lst[nowItem.name]) {
      dispatch(actions.itemSelect({
        mode: 'click',
        type: 'drag',
        items: [nowItem]
      }))
    }
  }, [dispatch, sltState]);
 
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!item.isFile && refContain(itemRef, e.target)) {
      itemDragSlt(item);
    }
    else if (refContain(allRef, e.target)) {
      itemDragSlt(nowFolder);
    }
  }, [item, itemDragSlt]);

  const colorState = useCallback((): string => {
    return sltState.lst[item.name] ? '#cce8ff' : '#fff'
  }, [sltState, item]);

  const isLast = useCallback(() => {
    return sltState.lastItem && sltState.lastItem.name === item.name;
  }, [sltState, item]);

  const getIcon = useCallback(() => {
    if (!item.isFile) return <Folder />;
    const lst = item.name.split('.');
    const ext = lst.length > 0 ? lst[lst.length - 1] : '';
    if (ext) {
      const imgexts = ['gif', 'jpg', 'png', 'bmp'];
      if (imgexts.includes(ext.toLowerCase())) {
        return <Image />;
      }
      if (ext === 'txt') {
        return <Description />;
      }
    }
    return <InsertDriveFile />;
  }, [item])

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
            {getIcon()}
          </Grid>
          <Grid item>
            <Tooltip title={item.name} placement='bottom-start' enterDelay={500}>
              <Typography noWrap={true} className={classes.typoText} style={{ color: isLast() ? '#0000ff' : '#000' }}>{item.name}</Typography>
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
