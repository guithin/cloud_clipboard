const router = require('express').Router();

router.use('/readdir', require('./readdir'));
router.use('/getPerm', require('./getPermission'));
router.use('/download', require('./downloadItem'));
router.use('/upload', require('./upload'));
router.use('/edit', require('./edit'));

module.exports = router;
