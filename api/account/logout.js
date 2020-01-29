const router = require('express').Router();

router.post('/', (req, res) => {
  if (res.clearCookie) {
    res.clearCookie('SUDAuth');
  }
  if (req.logout) {
    req.logout();
  }
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        throw err;
      }
      if (req.user) {
        delete req.user;
      }
      res.end();
    });
  }
  else {
    res.end();
  }
});

module.exports = router;