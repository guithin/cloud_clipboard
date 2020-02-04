import React from 'react';
import {
  createStyles, makeStyles, Theme,
} from '@material-ui/core/styles';
import Header from 'components/drive/Header';
import Sidebar from 'components/drive/Sidebar';
import {
  Switch,
  BrowserRouter as Router,
  Route
} from 'react-router-dom';
import Explorer from 'components/drive/Explorer';
import ItemMenu from 'components/drive/ItemMenu';
import UploadPopup from 'components/drive/UploadPopup';
import Uploading from 'components/drive/UploadState';

const useStyles = makeStyles((theme: Theme) => createStyles({
  toolbar: {
    ...theme.mixins.toolbar
  },
}));

const Main: React.FC = () => {
  const classes = useStyles();

  return (
    <>
      <Router>
        <Header />
        <Sidebar />
        <ItemMenu />
        <UploadPopup />
        <Uploading />
        <main>
          <div className={classes.toolbar} />
            <Switch>
              <Route path='/*' exact component={Explorer}/>
            </Switch>
        </main>
      </Router>
    </>
  );
}

export default Main;
