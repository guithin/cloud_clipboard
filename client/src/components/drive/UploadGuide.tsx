import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import { RootState } from 'store/types';
import { useSelector } from 'react-redux';
import { Paper, Typography } from '@material-ui/core';
import { CloudUploadOutlined } from '@material-ui/icons';

const selector = ({
  UploadGuide
}: RootState) => ({
  UploadGuide
});

const UploadGuideFC: React.FC = () => {

  const { UploadGuide } = useSelector(selector);
  const convertName = (name: string): string => {
    let foldername = JSON.stringify(name);
    if (name === '.') {
      foldername = '여기'
    }
    return foldername;
  }

  const getText = (name: string) => {
    return (
      <span>
        파일을 
        <span style={{ color: '#f00' }}>
          {convertName(name)}
        </span>
        에 업로드 하려면 드롭하세요.
      </span>
    )
  }

  return (
    <Snackbar
      open={!!UploadGuide.folder}
      key='uploadGuide'
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Paper
        style={{
          backgroundColor: '#fff',
          padding: '10px',
          textAlign: 'center'
        }}
      >
        <CloudUploadOutlined style={{ color: '#4285F4' }}/>
        <Typography>
          {getText(UploadGuide.folder || '.')}
        </Typography>
      </Paper>
    </Snackbar>
  )
}

export default UploadGuideFC;