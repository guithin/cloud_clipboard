const router = require('express').Router();
const auth = require('../../middlewares/auth2');

router.post('/', (req, res) => {
  auth.passport.authenticate('local', (err, userInfo) => {
    if (err) {
      return res.status(401).send({
        success: false,
        message: err 
      });
    }
    req.logIn(userInfo, err => {
      if (err) {
        return res.status(401).send({
          success: false,
          message: err
        });
      }
      return res.send(userInfo);  
    })
  })(req, res);
});

module.exports = router;