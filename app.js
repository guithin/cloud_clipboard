const express = require('express');
const bodyParser = require('body-parser');
const auth2 = require('./middlewares/auth2');
const cors = require('cors');
const compression = require('compression');
const sessionstore = require('sessionstore');
const session = require('express-session');
const path = require('path');
const config  = require('./config');

const app = express();

app.use(compression());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

global.store = sessionstore.createSessionStore();
app.use(session({
  name: 'SUDAuth',
  store: global.store,
  secret: config.sessionSecret,
  resave: true,
  saveUninitialized: true,
}));
app.use(auth2.passport.initialize()).use(auth2.passport.session());

app.use('/api', require('./router'));

app.use(express.static('client/build'));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build/index.html'));
});

app.get('*', (req, res) => {
  res.send('api server');
});

// const server = http.createServer(app);
app.listen(3001, () => {
  console.log('server start');
});