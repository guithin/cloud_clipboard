const router = require('express').Router();
const { userChecker } = require('../../middlewares/auth2');
const { permissionChecker } = require('../../middlewares/drivePermission');
const path = require('path');
const fs = require('fs');
const archiver = require('archiver');
const { drivePath } = require('../../config');

router.get('/*', userChecker(true), permissionChecker('r'), async (req, res) => {
  const reqPath = path.join(drivePath, decodeURIComponent(req.path));
  try {
    const isDir = fs.lstatSync(reqPath).isDirectory();
    if (isDir) {
      const paths = reqPath.split(path.sep).filter(i => i.length > 0);
      const dirName = paths[paths.length - 1];
      const zipName = dirName + '.zip';
      const archive = archiver('zip', {
        zlib: { level: 9 }
      });
      if (req.query.items) {
        const lst = JSON.parse(decodeURIComponent(req.query.items));
        if (!Array.isArray(lst)) return res.status(400).end();
        for (let i of lst) {
          const nowPath = path.join(reqPath, i);
          const itemDir = fs.lstatSync(nowPath).isDirectory();
          if (itemDir) {
            archive.directory(nowPath, i);
          }
          else {
            archive.append(fs.createReadStream(nowPath), { name: i });
          }
        }
      }
      else {
        archive.directory(reqPath, false);
      }
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', 'attachment; filename=' + zipName);
      archive.pipe(res);
      archive.finalize();
      return; 
    }
    return res.status(200).download(reqPath);
  }
  catch (err) {
    console.log(err)
    return res.status(400).end();
  }
});

module.exports = router;
