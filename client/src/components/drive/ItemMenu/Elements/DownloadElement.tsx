import React from 'react';
import { Link } from 'react-router-dom';
import { MenuItem } from '@material-ui/core';
import path from 'path';
import { serverHost } from 'store/utils';
import { SltState, ExplorerState } from 'store/explorer/content/types';

const DownloadElement = (
  sltState: SltState,
  main: ExplorerState
): JSX.Element => {
  const getLinkArgs = () => {
    const itemNames = Object.keys(sltState.lst);
    const searchParamObj = new URLSearchParams();
    if (main.token) {
      searchParamObj.set('token', main.token);
    }
    let pathname = path.join('/api/drive/download', main.nowPath);
    if (itemNames.length === 1) {
      pathname = path.join(pathname, itemNames[0]);
    }
    else {
      searchParamObj.set('items', JSON.stringify(itemNames));
    }
    pathname = serverHost + pathname;
    return {
      pathname,
      search: searchParamObj.toString()
    }
  }

  return (
    <Link
      to={getLinkArgs()}
      target='_black'
      style={{
        textDecoration: 'none',
        color: '#000'
      }}
      key='download'
    >
      <MenuItem
        key='download'
      >
        다운로드
      </MenuItem>
    </Link>
  )
}

export default DownloadElement;
