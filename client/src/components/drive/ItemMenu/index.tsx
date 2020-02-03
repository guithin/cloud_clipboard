import React, { useCallback } from 'react';
import { RootState } from 'store/types';
import { useSelector, useDispatch } from 'react-redux';
import { Popover, ClickAwayListener, Paper, MenuList, MenuItem } from '@material-ui/core';
import actions from 'store/explorer/content/actions';
import { ExplorerItem } from 'store/explorer/content/types';
import { Link } from 'react-router-dom';
import path from 'path';
import { serverHost } from 'store/utils';

const selector = ({
  menuState,
  sltState,
  explorerCont: { main }
}: RootState) => ({
  menuState,
  sltState,
  main
});

const ItemMenu: React.FC = () => {

  const { menuState, sltState, main } = useSelector(selector);
  const dispatch = useDispatch();

  const handleClose = useCallback(() => {
    dispatch(actions.menuClose());
  }, [dispatch]);

  const downloadElement = useCallback((item: ExplorerItem) => {
    return (
      <Link
        to={{
          pathname: path.join(serverHost, '/api/drive/download', main.nowPath, item.name),
          search: main.token ? '&token=' + main.token : ''
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
  }, [main]);

  const getMenuOpts = useCallback(() => {
    let ret = [] as JSX.Element[];
    const itemNames = Object.keys(sltState.lst);
    if (itemNames.length <= 0) return ret;
    const oneItem = sltState.lst[itemNames[0]];
    if (itemNames.length > 1) {
      // 공유, 이동, 다운로드, 삭제
    }
    else if (oneItem.name === '.' || oneItem.name === '..') {
      // 새폴더, 파일 업로드, 폴더 업로드
    }
    else if (oneItem.isFile) {
      // 공유, 이름바꾸기, 이동, 세부정부, 복사, 다운로드, 삭제
    }
    else {

    }
    return ret;
  }, [sltState]);

  return (
    <div>
      <Popover
        open={menuState.open}
        anchorReference='anchorPosition'
        anchorPosition={{
          top: menuState.posY || 0,
          left: menuState.posX || 0
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
    </div>
  )
}

export default ItemMenu;
