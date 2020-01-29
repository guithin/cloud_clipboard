const router = require('express').Router();
const fs = require('fs');
const path = require('path');
const { userChecker } = require('../../middlewares/auth2');
const { permissionChecker } = require('../../middlewares/drivePermission');
const { multiPartForm } = require('../../middlewares/utils');
const { drivePath } = require('../../config');
const { dirnameValidation } = require('./utils');

router.post('/*', multiPartForm, userChecker(true), permissionChecker('w'), (req, res) => {
  const reqPath = path.join(drivePath, decodeURIComponent(req.path));
  let filenames = [];
  for (let i in req.body.formFiles) {
    try {
      const item = req.body.formFiles[i][0];
      if (!dirnameValidation(item.originalFilename)) continue;
      fs.renameSync(item.path, path.join(reqPath, item.originalFilename));
      filenames.push(item.originalFilename);
    }
    catch (err) {
      console.log(err);
      return res.status(400).end();
    }
  }
  return res.send({
    success: true,
    filepath: req.path,
    filename: filenames,
    timeTag: req.body.formDatas.timeTag[0]
  });
});

module.exports = router;
