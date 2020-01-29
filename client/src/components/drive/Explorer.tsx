import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store/types';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import { ExStatus, ItemSelect, initItemSelect, ExplorerItem, nowFolder } from 'store/explorer/types';
import {ExplorerState, initState} from 'store/explorer/types';
import { TableHead, TableRow, TableCell, TableBody, Table, TableContainer } from '@material-ui/core';
import ExplorerPath from './ExplorerPath';
import ItemFC from './Item';
import Loading from 'components/Loading';
import {
  setSltState,
  functionMapper,
  refContain,
  clearSltState,
  convertPath,
} from 'store/explorer/functions';
import { useForceUpdate } from 'store/utils';
import actions from 'store/explorer/actions';
import path from 'path';

const selectEx = ({
  explorerConn,
  UploadGuide,
  user: {
    username
  }
}: RootState) => ({
  explorerConn,
  UploadGuide,
  username
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
  const tableRef = useRef<HTMLInputElement>(null);
  const cellsRef = useRef<HTMLInputElement>(null);
  const theadRef = useRef<HTMLInputElement>(null);
  const { explorerConn, UploadGuide, username } = useSelector(selectEx);

  const dispatch = useDispatch();
  const classes = useStyles();
  const history = useHistory();
  const forceUpdate = useForceUpdate();

  const [state, setState] = useState<ExplorerState>(initState);
  const [sltItem, setSltItem] = useState<ItemSelect>(initItemSelect());
  const [scnSize, setScnSize] = useState<{ width: number, height: number }>({ width: 0, height: 0 });

  const handleClickOutside = useCallback((e) => {
    if (cellsRef.current && !cellsRef.current.contains(e.target)) {
      clearSltState(sltItem, forceUpdate);
    }
  }, [sltItem, forceUpdate]);

  const handleScnSize = useCallback(() => {
    if (window.innerHeight !== scnSize.height || window.innerWidth !== scnSize.width) {
      setScnSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    }
  }, [scnSize]);

  const handleClickItem = useCallback((e, item, isFroceClick = false) => {
    if (item.name === '..' || item.name === '.') {
      return;
    }
    if (e.ctrlKey && !isFroceClick) setSltItem(setSltState('ctrl', sltItem, item));
    else if(e.shiftKey && !isFroceClick) setSltItem(setSltState('shift', sltItem, item, state.items));
    else setSltItem(setSltState('click', sltItem, item));
    forceUpdate();
  }, [sltItem, state.items, forceUpdate]);

  const handleRClickItem = useCallback((e, item: ExplorerItem) => {
    if (item.name === '.' || item.name === '..') {
      clearSltState(sltItem, forceUpdate);
    }
    if (!sltItem.lst.get(item.name)) {
      handleClickItem(e, item, true);
      dispatch(actions.menuOpen({
        open: true,
        item: [item],
        posX: e.pageX,
        posY: e.pageY
      }));
      return 
    }
    dispatch(actions.menuOpen({
      open: true,
      item: Array.from(sltItem.lst).map(i => i[1]),
      posX: e.pageX,
      posY: e.pageY
    }));
  }, [dispatch, forceUpdate, handleClickItem, sltItem]);

  const handleFileDND_OVER = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (refContain(cellsRef, e.target)) {
      for (let i of state.items) {
        if (refContain(i.refItem, e.target)) {
          if (i.isFile || refContain(i.refDate, e.target) || refContain(i.refSize, e.target) || i.name === '..') {
            clearSltState(sltItem, forceUpdate);
            if (!UploadGuide.folder || UploadGuide.folder !== '.') {
              dispatch(actions.uploadGuideSet({
                folder: '.'
              }))
            }
          }
          else if (sltItem.lst.size !== 1 || !sltItem.lst.get(i.name)) {
            setSltItem(setSltState('click', sltItem, i));
            dispatch(actions.uploadGuideSet({
              folder: i.name
            }))
            forceUpdate();
          }
          break;
        }
      }
    }
    else if (refContain(tableRef, e.target) && !refContain(theadRef, e.target)) {
      clearSltState(sltItem, forceUpdate);
      if (!UploadGuide.folder || UploadGuide.folder !== '.') {
        dispatch(actions.uploadGuideSet({
          folder: '.'
        }))
      }
    }
    else {
      clearSltState(sltItem, forceUpdate);
      if (UploadGuide.folder) dispatch(actions.uploadGuideUnset());
    }
  }, [state, sltItem, forceUpdate, UploadGuide, dispatch]);

  const handleFileDND_DROP = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (tableRef.current && !tableRef.current.contains(e.target)) return;
    if (theadRef.current && theadRef.current.contains(e.target)) return;
    let reqPath = convertPath(state.nowPath);
    if (sltItem.lst.size === 1) {
      const item = sltItem.lst.values().next().value;
      if (!item.isFile) {
        reqPath = path.join(reqPath, item.name);
      }
    }
    let lst: File[] = [];
    for (let i of e.dataTransfer.files) lst.push(i);
    dispatch(actions.uploadItems.request({
      path: reqPath,
      nowPath: state.nowPath,
      token: state.token || '',
      payload: lst,
      timeTag: new Date().getTime().toString()
    }));
    dispatch(actions.uploadGuideUnset());
  }, [dispatch, state, sltItem]);

  const handleFileDND = useCallback((e, name) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(name)
  }, []);

  useEffect(() => {
    functionMapper[state.status]({ state, setState, dispatch, explorerConn, username, history, sltItem });

    handleScnSize();

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('dragover', handleFileDND_OVER);
    document.addEventListener('drop', handleFileDND_DROP);
    document.addEventListener('selectstart', (e) => { e.preventDefault(); })

    // document.addEventListener('dragenter', (e) => handleFileDND(e, 'enter'));
    // document.addEventListener('dragleave', (e) => handleFileDND(e, 'leave'));
    
    // document.addEventListener('drag', (e) => handleFileDND(e, 'dragstart'))
    // document.addEventListener('dragend', (e) => handleFileDND(e, 'dragstart'))
    document.addEventListener('dragstart', (e) => console.log('asdf'))
    // document.addEventListener('drag', (e) => handleFileDND(e, 'dragstart'))
    // document.addEventListener('drag', (e) => handleFileDND(e, 'dragstart'))
    // document.addEventListener('drag', (e) => handleFileDND(e, 'dragstart'))


    window.addEventListener('resize', handleScnSize);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('dragover', handleFileDND_OVER);
      document.removeEventListener('drop', handleFileDND_DROP);
      document.removeEventListener('selectstart', (e) => { e.preventDefault(); })
      window.removeEventListener('resize', handleScnSize);
    }
  }, [
    explorerConn,
    state, dispatch, username,
    history, sltItem,
    handleClickOutside,
    handleScnSize,
    handleFileDND,
    handleFileDND_OVER,
    handleFileDND_DROP
  ]);

  const explorerComponent = () => {
    return (
      <div
        className={classes.root}
        onContextMenu={(e) => {
          e.preventDefault();
          handleRClickItem(e, nowFolder);
        }}
      >
        <ExplorerPath
          rootPath={state.rootPath}
          nowPath={state.nowPath}
        />
        <TableContainer
          style={{
            height: Math.max(scnSize.height - 150, 0),
            width: Math.max(scnSize.width - 240 - 20, 0)
          }}
          ref={tableRef}
        >
          <Table
            stickyHeader
            size='small'
          >
            <TableHead ref={theadRef}>
              <TableRow>
                <TableCell>이름</TableCell>
                <TableCell>크기</TableCell>
                <TableCell>수정 날짜</TableCell>
              </TableRow>
            </TableHead>
            <TableBody ref={cellsRef}>
              {state.items.map(item => (
                <ItemFC
                  key={item.name}
                  item={item}
                  onClick={handleClickItem}
                  onRClick={handleRClickItem}
                  isLast={(sltItem.lastItem && sltItem.lastItem.name === item.name) || false}
                  isSelect={sltItem.lst.has(item.name)}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    )
  }

  return (
    <div>
      { state.status === ExStatus.EX_DONE ? explorerComponent() :
        state.status === ExStatus.EX_ERROR ? state.err :
        <Loading />}
    </div>
  );
}

export default Explorer;
