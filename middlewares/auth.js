const passport = require('passport');
const cookie = require('cookie');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../db/User');
const passwordHash = require('password-hash');

let retVal = {
  passport
};

retVal.passport.use(new LocalStrategy(async (username, password, done) => {
  let user = await User.findOne({
    where: {
      username,
      valid_code: 0
    }
  }).catch(err => null);
  if (!user) {
    return done(new Error('login fail'));
  }
  if (!passwordHash.verify(password, user.password)) {
    return done(new Error('login fail'));
  }
  return done(null, user);
}));

retVal.passport.serializeUser((user, done) => {
  done(null, user);
});

retVal.passport.deserializeUser((user, done) => {
  done(null, user);
});

retVal.isLogin = (req) => {
  if (req.user) {
    return req.user;
  }
  if (req.headers.cookie) {
    let sid = cookie.parse(req.headers.cookie)['Auth'];
    if (sid){
      global.store.get(sid.slice('.')[0].substring(2), (err, session) => {
        if (session && session.passport && session.passport.user) {
          return session.passport.user;
        }
        else {
          return null;
        }
      });
    }
    else {
      return null;
    }
  }
};

retVal.loginChecker = (req, res, next) => {
  if (req.path.startsWith('/api/account')) {
    next();
    return;
  }
  if (req.user) {
    next();
    return;
  }
  let user = retVal.isLogin(req);
  if (!user) {
    res.redirect('/api/account/login');
    return;
  }
  req.user = user;
  next();
}

module.exports = retVal;
