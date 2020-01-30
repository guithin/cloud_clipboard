import React, { useCallback, useState } from 'react';
import { RootState } from 'store/types';
import { useSelector, useDispatch } from 'react-redux';
import {
  Paper,
  ClickAwayListener,
  MenuList,
  MenuItem,
  Popover,
} from '@material-ui/core';
import actions from 'store/explorer/actions';
import { ExplorerItem } from 'store/explorer/types';
import DetailDialog from './itemMenuDialogs/DetailDialog'
import DeleteDialog from './itemMenuDialogs/DeleteDialog';
import { convertPath, getDownloadLink } from 'store/explorer/functions';
import MkdirDialog from './itemMenuDialogs/MkdirDialog';
import RenameDialog from './itemMenuDialogs/RenameDialog';
import path from 'path';
import { Link } from 'react-router-dom';

const selector = ({
  MenuStatus
}: RootState) => ({
  MenuStatus
});

const ItemMenu: React.FC = () => {
  const { MenuStatus } = useSelector(selector);
  const dispatch = useDispatch();
  const [state, _setState] = useState<'none' | 'delete' | 'detail' | 'mkdir' | 'rename'>('none');

  const setState = useCallback((param) => {
    dispatch(actions.menuClose());
    _setState(param);
  }, [dispatch]);

  const handleClose = useCallback(() => {
    dispatch(actions.menuClose());
  }, [dispatch]);

  const detailElement = useCallback((item: ExplorerItem) => {
    return (
      <MenuItem 
        onClick={() => setState('detail')}
        key='detail'
      >
        세부 정보
      </MenuItem>
    )
  }, [setState]);

  const deleteElement = useCallback((itmes: ExplorerItem[]) => {
    return (
      <MenuItem 
        onClick={() => setState('delete')}
        key='delete'
      >
        삭제
      </MenuItem>
    )
  }, [setState]);

  const mkdirElement = useCallback(() => {
    return (
      <MenuItem
        onClick={() => setState('mkdir')}
        key='mkdir'
      >
        새 폴더
      </MenuItem>
    )
  }, [setState]);

  const renameElement = useCallback(() => {
    return (
      <MenuItem
        onClick={() => setState('rename')}
        key='rename'
      >
        이름 바꾸기
      </MenuItem>
    )
  }, [setState]);

  const downloadElement = useCallback((items: ExplorerItem[]) => {
    let search = window.location.search;
    if (items.length > 1) {
      search += `&items=${JSON.stringify(items.map(i => i.name))}`;
    }
    return (
      <Link
        to={{
          pathname: getDownloadLink(items.length > 1 ? '' : items[0].name),
          search
        }}
        target='_blank'
        style={{
          textDecoration: 'none',
          color: '#000'
        }}
      >
        <MenuItem
          key='download'
        >
          다운로드
        </MenuItem>
      </Link>
    )
  }, []);

  const handleDelete = useCallback(() => {
    if (!MenuStatus.item) return;
    dispatch(actions.editQuery.request({
      type: 'rm',
      path: convertPath(window.location.pathname),
      command: JSON.stringify(MenuStatus.item.map(i => i.name)),
      token: window.location.search,
      timeTag: new Date().getTime().toString()
    }))
  }, [dispatch, MenuStatus.item]);

  const handleMkdir = useCallback((dirName: string) => {
    dispatch(actions.editQuery.request({
      type: 'mkdir',
      path: convertPath(window.location.pathname),
      command: dirName,
      token: window.location.search,
      timeTag: new Date().getTime().toString()
    }))
  }, [dispatch]);

  const handleRename = useCallback((name: string) => {
    if (!MenuStatus.item) return;
    const nowPath = convertPath(window.location.pathname);
    dispatch(actions.editQuery.request({
      type: 'mv',
      path: nowPath,
      command: JSON.stringify({
        item: MenuStatus.item[0].name,
        movePath: path.join(nowPath, name)
      }),
      token: window.location.search,
      timeTag: new Date().getTime().toString()
    }))
  }, [dispatch, MenuStatus.item])

  const getMenuOpts = useCallback(() => {
    const items = MenuStatus.item;
    let ret: JSX.Element[] = [];
    if (!items || items.length <= 0) return ret;

    if (items.length > 1) {
      // 공유, 이동, 다운로드, 삭제
      ret.push(deleteElement(items));
      ret.push(downloadElement(items));
    }
    else if (items[0].name === '.' || items[0].name === '..') {
      // 새폴더, 파일 업로드, 폴더 업로드
      ret.push(mkdirElement());
    }
    else if (items[0].isFile) {
      // 공유, 이름바꾸기, 이동, 세부정부, 복사, 다운로드, 삭제
      ret.push(detailElement(items[0]));
      ret.push(renameElement());
      ret.push(deleteElement(items));
      ret.push(downloadElement(items));
    }
    else {
      // 공유, 이름바꾸기, 이동, 세부정부, 복사, 다운로드, 삭제
      ret.push(detailElement(items[0]));
      ret.push(renameElement());
      ret.push(deleteElement(items));
      ret.push(downloadElement(items));
    }
    return ret;
  }, [
    MenuStatus.item,
    detailElement,
    deleteElement,
    mkdirElement,
    renameElement,
    downloadElement
  ]);

  return (
    <div>
      <Popover
        open={MenuStatus.open}
        anchorReference='anchorPosition'
        anchorPosition={{
          top: MenuStatus.posY || 0,
          left: MenuStatus.posX || 0
        }}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
        style={{
          position: 'static'
        }}
      >
        <Paper>
          <ClickAwayListener onClickAway={handleClose}>
            <MenuList>
              {getMenuOpts()}
            </MenuList>
          </ClickAwayListener>
        </Paper>
      </Popover>
      <DetailDialog
        item={MenuStatus.item && MenuStatus.item[0]}
        open={state === 'detail'}
        onClose={() => setState('none')}
      />
      <DeleteDialog
        item={MenuStatus.item}
        open={state === 'delete'}
        onClose={() => setState('none')}
        confirm={handleDelete}
      />
      <MkdirDialog
        open={state === 'mkdir'}
        onClose={() => setState('none')}
        confirm={handleMkdir}
      />
      <RenameDialog
        item={MenuStatus.item && MenuStatus.item[0]}
        open={state === 'rename'}
        onClose={() => setState('none')}
        confirm={handleRename}
      />
    </div>
  )
}

export default ItemMenu;
