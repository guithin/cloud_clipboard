import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContentText,
  DialogContent
} from '@material-ui/core';
import { ExplorerItem } from 'store/explorer/types';

const itemMenuDialogs: React.FC<{
  item: ExplorerItem | undefined,
  open: boolean,
  onClose: Function
}> = ({
  item,
  open,
  onClose
}) => {

  const getExtFromName = (name: string): string => {
    const lst = name.split('.');
    if (lst.length <= 1) return '';
    return lst[lst.length - 1];
  }

  return (
    <Dialog
      open={open && !!item}
      onClose={() => onClose()}
    >
      <DialogTitle>
        세부 정보
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          이름: {item && item.name}
        </DialogContentText>
        <DialogContentText>
          파일 타입: {(item && item.isFile) ? getExtFromName(item.name) + ' 파일' : '폴더'}
        </DialogContentText>
        <DialogContentText>
          크기: {item && item.meta.size}
        </DialogContentText>
        <DialogContentText>
          마지막 접근 일: {item && item.meta.atime}
        </DialogContentText>
        <DialogContentText>
          마지막 변경 일: {item &&item.meta.mtime}
        </DialogContentText>
        <DialogContentText>
          셍성 일: {item && item.meta.birthtime}
        </DialogContentText>
      </DialogContent>
    </Dialog>
  )
}

export default itemMenuDialogs;
