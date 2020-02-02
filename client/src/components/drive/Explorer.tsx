import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'store/types';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { TableContainer, Table, TableHead, TableRow, TableBody, TableCell } from '@material-ui/core';
import { functionMapper } from 'store/explorer/functions';
import Loading from 'components/Loading';
import ItemFC from './ExplorerItem';
import ExplorerPath from './ExploterPath';
import { useHistory } from 'react-router-dom';
import actions from 'store/explorer/content/actions';

const selector = ({
  explorerCont: { main },
  user: { username },
  sltState,
}: RootState) => ({
  main, username, sltState
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

  const dispatch = useDispatch();
  const history = useHistory();
  const classes = useStyles();
  const { main, username, sltState } = useSelector(selector);
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
      dispatch(actions.itemClear());
    }
  }, [dispatch]);

  const handleDrageOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (cellsRef.current && !cellsRef.current.contains(e.target) && Object.keys(sltState.lst).length > 0) {
      dispatch(actions.itemClear());
    }
  }, [dispatch, sltState]);

  useEffect(() => {
    const fetchFunc = functionMapper[(main && main.status) || 'begin'];
    fetchFunc({ main, dispatch, username, history, });
    checkTableSize();
    window.addEventListener('resize', checkTableSize);
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('dragover', handleDrageOver);
    return () => {
      window.removeEventListener('resize', checkTableSize);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('dragover', handleDrageOver);
    }
  }, [
    main,
    username,
    history,
    dispatch,
    checkTableSize,
    history.location,
    handleClickOutside,
    handleDrageOver
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
