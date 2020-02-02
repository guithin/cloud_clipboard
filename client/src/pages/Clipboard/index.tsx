import React, { useState } from 'react';
import { Content } from 'store/clipboard/types';
import { List, ListItem, Typography, Dialog, AppBar, Toolbar, IconButton } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import {
  createStyles, makeStyles, Theme,
} from '@material-ui/core/styles';

const testlists: Content[] = [
  {
    time: '1580271639462',
    type: 'text',
    payload: '가나다라',
  },
  {
    time: '1580271639472',
    type: 'image',
    payload: 'http://localhost:3001/api/drive/download/won0114/사원증사진_직사각.jpg'
  }
];

const useStyles = makeStyles((theme: Theme) => createStyles({
  toolbar: {
    ...theme.mixins.toolbar
  }
}))

const Clipboard: React.FC = () => {

  const classes = useStyles();

  const [state, setState] = useState<{ type: 'none' | 'image', payload: string }>({
    type: 'none',
    payload: ''
  });
  
  return (
    <div>
      <List style={{ position: 'fixed', width: '100%' }}>
        {testlists.map(item => (
          <ListItem
            key={item.time}
            style={{
              width: '100%'
            }}
            divider
          >
            {item.type === 'text' ? (
              <Typography>
                {item.payload}
              </Typography>
            ) : item.type === 'image' ? (
              <img src={item.payload} width='100px' onClick={() => setState({ type: 'image', payload: item.payload})} alt='alert'/>
            ): (
              <div>asdf</div>
            )}
          </ListItem>
        ))}
      </List>
      <Dialog
        fullScreen
        open={state.type === 'image'}
      >
        <AppBar>
          <Toolbar>
            <IconButton edge='start' color='inherit' onClick={() => setState({payload: '', type: 'none'})} aria-label='close'>
              <Close />
            </IconButton>
          </Toolbar>
        </AppBar>
        <div className={classes.toolbar} />
        <div style={{ justifyContent: 'center', display: 'flex', width: '100%'}}>
          <img src={state.payload} width='500px' alt='alert'/>
        </div>
      </Dialog>
    </div>
  )
}

export default Clipboard;
