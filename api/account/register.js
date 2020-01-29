const router = require('express').Router();
const { idValidCheck, passwdValidCheck } = require('../../middlewares/auth2');
const path = require('path');
const passwordHash = require('password-hash');
const User = require('../../db/User');
const jwt = require('jsonwebtoken');
const config = require('../../config');

const jwtSecret = config.jwtSecret;

router.post('/', (req, res) => {
  if (!config.allowRegister) {
    return res.status(400).json({ success: false, message: 'register not allowed' });
  }
  let username = req.body.username;
  let password = req.body.password;
  if (!idValidCheck(username)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID'
    });
  }
  if (!passwdValidCheck(password)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid Password'
    });
  }

  User.findOrCreate({
    where: {
      username: username
    },
    defaults: {
      password: passwordHash.generate(password, { algorithm: 'sha256' }),
      valid_code: 0
    }
  }).spread((user, created) => {
    if (created) {
      const payload = { username: user.username, password: user.password };
      const token = jwt.sign(payload, jwtSecret);
      return res.json({
        username: user.username,
        token
      });
    }
    else {
      return res.status(400).json({ success: false, message: 'Duplicated username' });
    }
  }).catch((err) => {
    return res.status(400).json({ success: false, message: `DB_Error - ${err}` });
  });
});

module.exports = router;
