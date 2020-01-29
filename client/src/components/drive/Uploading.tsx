import React, { useCallback, useState } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import { RootState } from 'store/types';
import { useSelector, useDispatch } from 'react-redux';
import {
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  List,
  ListItem, 
  ListItemIcon,
  Typography,
  Card,
  CardHeader,
  CardContent
} from '@material-ui/core';
import { Close, Loop, CheckCircle, Error, Warning } from '@material-ui/icons';
import actions from 'store/explorer/actions';
import { ExResUP } from 'store/explorer/types';
import {
  createStyles, makeStyles, Theme,
} from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import path from 'path';

const useStyles = makeStyles((theme: Theme) => createStyles({
  card: {
    maxWidth: '300px',
    minWidth: '300px'
  },
  cardH: {
    color: '#fff',
    backgroundColor: '#393939',
    padding: '5px',
  },
  cardCont: {
    padding: '0px',
    '&:last-child': {
      padding: '0px'
    }
  }
}))

const selector = ({
  explorerConn: {
    upload
  }
}: RootState) => ({
  upload
});

const Uploading: React.FC = () => {

  const classes = useStyles();
  const dispatch = useDispatch();
  const [state, setState] = useState(false);
  const { upload } = useSelector(selector);


  const handleClose = useCallback(() => {
    if (!upload) return;
    let confirm = false;
    for (let i in upload) {
      if (upload[i].status === 'begin' || upload[i].status === 'loading') {
        confirm = true;
        break;
      }
    }
    if (confirm) {
      setState(true);
    }
    else {
      dispatch(actions.deleteUPQuery());
    }
  }, [dispatch, upload]);

  const uploadCancel = useCallback(() => {
    // 주의! 아직 취소 안됨 ㅋ
    dispatch(actions.deleteUPQuery());
    setState(false);
  }, [dispatch]);

  const handleDialogClose = useCallback(() => {
    setState(false);
  }, []);

  const getCont = useCallback(() => {
    if (!upload) return [];
    let lst: ExResUP[] = [];
    for (let i in upload) {
      lst.push(upload[i])
    }
    return lst;
  }, [upload]);

  const getText = useCallback((item: ExResUP): string => {
    if (!item.result) return '';
    let ret = item.result.filename[0];
    if (item.result.filename.length > 1) ret += `외 ${item.result.filename.length - 1}개 파일`;
    return ret;
  }, [])

  return (
    <div>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        key='uploading'
        open={!!upload}
      >
        <Card className={classes.card}>
          <CardHeader
            className={classes.cardH}
            title={<Typography style={{ fontSize: '15px', marginLeft: '15px' }}>업로드 목록</Typography>}
            action={
              <IconButton key='close' aria-label='close' color='inherit' onClick={handleClose}>
                <Close />
              </IconButton>
            }
          />
          <CardContent className={classes.cardCont}>
            <List>
              {getCont().map(item => (
                <Link
                  to={{
                    pathname: path.join('/drive', (item.result && item.result.filepath) || ''),
                    search: window.location.search
                  }}
                  style={{ textDecoration: 'none' }}
                  key={item.timeTag}
                >
                  <ListItem button key={item.timeTag}>
                    <ListItemIcon>
                      {(item.status === 'begin' || item.status === 'loading') ? <Loop /> :
                       (item.status === 'success' || item.status === 'done') ? <CheckCircle style={{ color: '#4CAF50' }} /> :
                          <Error style={{ color: '#F44336' }} />}
                    </ListItemIcon>
                    <Typography noWrap={true} color='textPrimary' style={{ fontSize: '15px' }}>
                      {getText(item)}
                    </Typography>
                  </ListItem>
                </Link>
              ))}
            </List>
          </CardContent>
        </Card>
      </Snackbar>
      <Dialog
        open={state}
        onClose={handleDialogClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>
          업로드를 취소하시겠습니까?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            업로드가 완료되지 않았습니다. 업로드를 취소하시겠습니까?
            <br />
            <span style={{ color: '#f00' }}> <Warning /> 주의! 아직 취소 안됨 ㅋ</span>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color='primary'>
            업로드 계속
          </Button>
          <Button onClick={uploadCancel} color='primary'>
            업로드 취소
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default Uploading;
