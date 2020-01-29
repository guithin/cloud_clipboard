import React from 'react';
import { Snackbar, Paper } from '@material-ui/core';

const Test: React.FC = () => {
  return (
    <Snackbar open={true}>
      <Paper
        style={{
          height: '100px',
          width: '100px'
        }}
      >
        asdfasdf
      </Paper>
    </Snackbar>
  );
}

export default Test;
