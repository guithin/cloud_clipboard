import React, { useCallback } from 'react';
import { Dialog, DialogTitle, DialogContentText, DialogContent } from '@material-ui/core';
import { RootState } from 'store/types';
import { useSelector, useDispatch } from 'react-redux';
import actions from 'store/explorer/content/actions';
import { ExplorerItem } from 'store/explorer/content/types';

const selector = ({
  menuState,
  sltState
}: RootState) => ({
  menuState,
  sltState
});

const detailList = [
  {
    key: 'name',
    displayString: '이름',
    value: (item: ExplorerItem) => {
      return item.name;
    }
  },
  {
    key: 'fileType',
    displayString: '파일 타입',
    value: (item: ExplorerItem) => {
      if (!item.isFile) return '폴더';
      let lst = item.name.split('.');
      let ret = '';
      if (lst.length > 1) {
        ret = lst[lst.length - 1];
      }
      return ret + ' 파일';
    }
  },
  {
    key: 'size',
    displayString: '크기',
    value: (item: ExplorerItem) => {
      return item.meta.size.toString();
    }
  },
  {
    key: 'atime',
    displayString: '마지막 접근 일',
    value: (item: ExplorerItem) => {
      return item.meta.atime;
    }
  },
  {
    key: 'mtime',
    displayString: '마지막 변경 일',
    value: (item: ExplorerItem) => {
      return item.meta.mtime;
    }
  },
  {
    key: 'birthtime',
    displayString: '셍성 일',
    value: (item: ExplorerItem) => {
      return item.meta.birthtime;
    }
  },
];

const DetailDialog: React.FC = () => {

  const { menuState, sltState } = useSelector(selector);
  const dispatch = useDispatch();

  const handleClose = useCallback(() => {
    dispatch(actions.menuClose());
  }, [dispatch]);

  const getItem = useCallback(() => {
    return sltState.lst[Object.keys(sltState.lst)[0]];
  }, [sltState]);

  return (
    <Dialog
      open={menuState.dialogState === 'detail'}
      onClose={handleClose}
    >
      <DialogTitle>
        세부 정보
      </DialogTitle>
      <DialogContent>
        {menuState.dialogState === 'detail' && detailList.map(i => (
          <DialogContentText
            key={i.key}
          >
            {i.displayString}: {i.value(getItem())}
          </DialogContentText>
        ))}
      </DialogContent>
    </Dialog>
  )
}

export default DetailDialog;
