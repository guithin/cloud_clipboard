import React from 'react';
import {
  createStyles, makeStyles, Theme,
} from '@material-ui/core/styles';
import Header from '../../components/drive/Header';
import Sidebar from '../../components/drive/Sidebar';
import Explorer from '../../components/drive/Explorer';
import UploadGuideFC from '../../components/drive/UploadGuide';
import {
  Switch,
  BrowserRouter as Router,
  Route
} from 'react-router-dom';
import ItemMenu from 'components/drive/ItemMenu';
import Uploading from 'components/drive/Uploading';

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
        <main>
          <div className={classes.toolbar} />
            <Switch>
              <Route path='/*' exact component={Explorer}/>
            </Switch>
        </main>
        <UploadGuideFC />
        <ItemMenu />
        <Uploading />
      </Router>
    </>
  );
}

export default Main;
