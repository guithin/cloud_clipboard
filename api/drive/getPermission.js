const router = require('express').Router();
const { userChecker } = require('../../middlewares/auth2');
const { getPermission } = require('../../middlewares/drivePermission');

router.get('/', userChecker(true), getPermission, (req, res) => {
  res.send(req.permissions);
});

module.exports = router;
