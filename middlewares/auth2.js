const jwt = require('jsonwebtoken');
const User = require('../db/User');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passwordHash = require('password-hash');
const cookie = require('cookie');
const config = require('../config');

const jwtSecret = config.jwtSecret;

const idValidCheck = (id) => {
  const len = id.length;
  if (!len || len <= 0 || len > 16) {
    return false;
  }
  const reg = id.match('([a-z]|[A-Z])([a-z]|[A-Z]|[0-9])*');
  if (!reg || reg[0] !== id) {
    return false;
  }

  return true;
}

const passwdValidCheck = (passwd) => {
  const len = passwd.length;
  if (!len || len < 1 || len > 20) {
    return false;
  }
  const reg = passwd.match('([a-z]|[A-Z]|[0-9])*');
  if (!reg || reg[0] !== passwd) {
    return false;
  }
  try {
    passwordHash.generate(passwd, { algorithm: 'sha256' })
  }
  catch (err) {
    return false;
  }

  return true;
}

passport.use(new LocalStrategy(async (username, password, done) => {
  if (!idValidCheck(username) || !passwdValidCheck(password)) {
    return done('유저를 찾을 수 없습니다.');
  }
  const user = await User.findOne({
    where: {
      username,
      valid_code: 0
    }
  }).catch(() => null);
  if (!user) {
    return done('유저를 찾을 수 없습니다.');
  }
  if (!passwordHash.verify(password, user.password)) {
    return done('비밀번호가 틀렸습니다.');
  }
  const payload = { username: user.username, password: user.password };
  const token = jwt.sign(payload, jwtSecret);
  return done(null, {
    token,
    username: user.username
  });
}));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

const userChecker = (allowGuest = false) => async (req, res, next) => {
  if (req.user) {
    next();
    return null;
  }

  /* from iori (what is this code??)
  if (req.headers.cookie) {
    const SUDAuth = await cookie.parse(req.headers.cookie)['SUDAuth'];
    if (SUDAuth) {
      global.store.get(SUDAuth.split('.')[0].substring(2), (err, session) => {
        if (session && session.passport && session.passport.user) {
          req.user = session.passport.user;
          next();
        }
      });
    }
  }
  */

  if (!req.headers.authorization) {
    return allowGuest ? next() : res.status(401).end();
  }

  const token = req.headers.authorization.split(' ')[1];
  jwt.verify(token, jwtSecret, (err, decode) => {
    if (err) {
      return res.status(401).end();
    }
    const { username, password } = decode;
    User.findOne({
      where: {
        username,
        password,
        valid_code: 0
      }
    }).then(user => {
      if (!user) {
        return res.status(401).end({});
      }
      req.logIn(user, err => {
        if (err) {
          return res.status(401).end({});
        }
        req.user = user;
        next();
      });
      return null;
    }).catch(() => {
      res.status(401).end({});
    });
  });
}

module.exports = {
  passport, userChecker,
  idValidCheck, passwdValidCheck
};