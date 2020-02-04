import React, { useCallback } from 'react';
import { RootState } from 'store/types';
import { useSelector, useDispatch } from 'react-redux';
import { Popover, ClickAwayListener, Paper, MenuList } from '@material-ui/core';
import actions from 'store/explorer/content/actions';
import DownloadElement from './Elements/DownloadElement';
import OpenDialog from './Elements/OpenDialogElemet';
import DetailDialog from './Dialogs/DetailDialog';
import DeleteDialog from './Dialogs/DeleteDialog';

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

  const getMenuOpts = useCallback(() => {
    let ret = [] as JSX.Element[];
    const itemNames = Object.keys(sltState.lst);
    if (itemNames.length <= 0) return ret;
    const oneItem = sltState.lst[itemNames[0]];
    if (itemNames.length > 1) {
      // 공유, 이동, 다운로드, 삭제
      ret.push(DownloadElement(sltState, main));
      ret.push(OpenDialog(dispatch, 'delete', '삭제'));
    }
    else if (oneItem.name === '.' || oneItem.name === '..') {
      // 새폴더, 파일 업로드, 폴더 업로드
      ret.push(OpenDialog(dispatch, 'mkdir', '새 폴더'));
    }
    else if (oneItem.isFile) {
      // 공유, 이름바꾸기, 이동, 세부정부, 복사, 다운로드, 삭제
      ret.push(OpenDialog(dispatch, 'detail', '세부 정보'));
      ret.push(OpenDialog(dispatch, 'mv', '이동'));
      ret.push(OpenDialog(dispatch, 'rename', '이름 바꾸기'));
      ret.push(DownloadElement(sltState, main));
      ret.push(OpenDialog(dispatch, 'delete', '삭제'));
    }
    else {
      // 공유, 이름바꾸기, 이동, 세부정부, 복사, 다운로드, 삭제
      ret.push(OpenDialog(dispatch, 'detail', '세부 정보'));
      ret.push(OpenDialog(dispatch, 'mv', '이동'));
      ret.push(OpenDialog(dispatch, 'rename', '이름 바꾸기'));
      ret.push(DownloadElement(sltState, main));
      ret.push(OpenDialog(dispatch, 'delete', '삭제'));
    }
    return ret;
  }, [sltState, main, dispatch]);

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
      <DetailDialog />
      <DeleteDialog />
    </div>
  )
}

export default ItemMenu;
