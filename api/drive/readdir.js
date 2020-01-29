const router = require('express').Router();
const fs = require('fs');
const path = require('path');
const { userChecker } = require('../../middlewares/auth2');
const { permissionChecker } = require('../../middlewares/drivePermission');

const { drivePath } = require('../../config');

router.post('/*', userChecker(true), permissionChecker('r'), async (req, res) => {
  const reqPath = path.join(drivePath, decodeURIComponent(req.path));
  try {
    let files = fs.readdirSync(reqPath, { withFileTypes: true });
    files = files.map(file => {
      let meta = fs.statSync(path.join(reqPath, file.name));
      meta = {
        size: meta.size,
        atime: meta.atime,
        mtime: meta.mtime,
        ctime: meta.ctime,
        birthtime: meta.birthtime
      };
      return {
        name: file.name,
        isFile: file.isFile(),
        meta
      };
    });
    return res.send({
      rootPath: req.permLev.rootPath,
      files
    });
  }
  catch {
    res.status(400).end('디렉토리가 존재하지 않습니다.');
  }
});

module.exports = router;
