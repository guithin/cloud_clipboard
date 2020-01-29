const router = require('express').Router();

router.use('/account', require('./api/account'));
router.use('/drive', require('./api/drive'));

module.exports = router;
