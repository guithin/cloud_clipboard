import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'store/types';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { TableContainer, Table, TableHead, TableRow, TableBody, TableCell } from '@material-ui/core';
import { functionMapper, refContain } from 'store/explorer/functions';
import crypto from 'crypto';
import path from 'path';
import Loading from 'components/Loading';
import ItemFC from './ExplorerItem';
import ExplorerPath from './ExploterPath';
import { useHistory } from 'react-router-dom';
import contActions from 'store/explorer/content/actions';
import commActions from 'store/explorer/comm/actions';

const selector = ({
  explorerCom: { upload },
  explorerCont: { main },
  user: { username },
  sltState,
}: RootState) => ({
  upload, main, username, sltState
});

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    position: 'fixed',
    width: '100%',
    height:'100%'
  },
  tableCont: {
    height: '700px'
  }
}));

const Explorer: React.FC = () => {
  const cellsRef = useRef<HTMLInputElement>(null);
  const tableRef = useRef<HTMLInputElement>(null);

  const dispatch = useDispatch();
  const history = useHistory();
  const classes = useStyles();
  const { upload, main, username, sltState } = useSelector(selector);
  const [tableSize, setTableSize] = useState({ width: 0, height: 0 });

  const checkTableSize = useCallback(() => {
    const transWidth = Math.max(window.innerWidth - 240 - 20, 0);
    const transHeight = Math.max(window.innerHeight - 150, 0);
    if (tableSize.width !== transWidth || tableSize.height !== transHeight) {
      setTableSize({
        width: transWidth,
        height: transHeight
      })
    }
  }, [tableSize]);

  const handleClickOutside = useCallback((e) => {
    if (cellsRef.current && !cellsRef.current.contains(e.target)) {
      if (e.type === 'contextmenu' && refContain(tableRef, e.target)) return;
      dispatch(contActions.itemClear());
    }
  }, [dispatch]);

  const handleRClick = useCallback((e) => {
    e.preventDefault();
    if (refContain(cellsRef, e.target)) return;
    dispatch(contActions.itemClear());
    dispatch(contActions.menuOpen({
      posX: e.pageX,
      posY: e.pageY
    }))
  }, [dispatch]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (cellsRef.current && !cellsRef.current.contains(e.target) && Object.keys(sltState.lst).length > 0) {
      dispatch(contActions.itemClear());
    }
  }, [dispatch, sltState]);

  const handleDragDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (refContain(tableRef, e.target)) {
      let _path = main && main.nowPath;
      if (sltState.type === 'drag') {
        const temp = sltState.lst[Object.keys(sltState.lst)[0]].name;
        _path = path.join(_path, temp);
      }
      let files: File[] = [];
      for (let i of e.dataTransfer.files) files.push(i);
      dispatch(commActions.uploadRequest.request({
        path: _path,
        files,
        token: (main && main.token) || '',
        tagName: crypto.createHash('sha256').update(_path +new Date().getTime().toString()).digest('base64')
      }))
    }
  }, [dispatch, sltState, main]);

  useEffect(() => {
    const fetchFunc = functionMapper[(main && main.status) || 'begin'];
    fetchFunc({ main, dispatch, username, history, upload });
    checkTableSize();
    window.addEventListener('resize', checkTableSize);
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('dragover', handleDragOver);
    document.addEventListener('drop', handleDragDrop);
    document.addEventListener('selectstart', (e) => { e.preventDefault(); });
    return () => {
      window.removeEventListener('resize', checkTableSize);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('dragover', handleDragOver);
      document.removeEventListener('drop', handleDragDrop);
      document.removeEventListener('selectstart', (e) => { e.preventDefault(); });
    }
  }, [
    main,
    upload,
    username,
    history,
    dispatch,
    checkTableSize,
    history.location,
    handleClickOutside,
    handleDragOver,
    handleDragDrop
  ]);

  return (
    <>
      {!main || main.status !== 'success' || !main.nowPath ? (
        <Loading />
      ) :  (
        <div className={classes.root}>
          <ExplorerPath />
          <TableContainer
            style={{
              height: tableSize.height,
              width: tableSize.width
            }}
            onContextMenu={handleRClick}
            ref={tableRef}
          >
            <Table stickyHeader size='small'>
              <TableHead>
                <TableRow>
                  <TableCell>이름</TableCell>
                  <TableCell>크기</TableCell>
                  <TableCell>수정 날짜</TableCell>
                </TableRow>
              </TableHead>
              <TableBody ref={cellsRef}>
                {main && main.items && main.items.map(item => (
                  <ItemFC item={item} key={item.name}/>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      )}
    </>
  )
}

export default Explorer;
