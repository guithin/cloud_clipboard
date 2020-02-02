const router = require('express').Router();
const { userChecker } = require('../../middlewares/auth2');
const { permissionChecker } = require('../../middlewares/drivePermission');
const path = require('path');
const fs = require('fs');
const archiver = require('archiver');
const { drivePath } = require('../../config');

router.get('/sync', (req, res) => {
  const tagName = req.query.tagName;
  console.log(tagName)
  const fetch = progress[tagName];
  res.send(fetch || {});
});

router.get('/*', userChecker(true), permissionChecker('r'), async (req, res) => {
  const reqPath = path.join(drivePath, decodeURIComponent(req.path));
  try {
    const isDir = fs.lstatSync(reqPath).isDirectory();
    if (isDir) {
      let paths = reqPath.split(path.sep).filter(i => i.length > 0);
      let dirName = paths[paths.length - 1];
      let zipName = dirName + '.zip';
      let archive = archiver('zip', {
        zlib: { level: 9 }
      });
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', 'attachment; filename=' + zipName);
      archive.pipe(res);
      archive.directory(reqPath, false);
      // archive.on('progress', data => console.log(data));
      // archive.on('progress', data => updateprogress(data, req.query.tagName));
      // res.on('close', () => closeProgress(req.query.tagName));
      res.on('pipe', i => console.log(i))
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

const progress = {};

//tagName -> `${reqPath}#${timeTag}`
const updateprogress = (data, tagName) => {
  progress[tagName] = data;
  console.log(tagName)
  if (data.fs.totalBytes === data.fs.processedBytes) {
    setTimeout(() => {
      delete progress[tagName];
    }, 10 * 1000);
  }
}

const closeProgress = (tagName) => delete progress[tagName];

module.exports = router;
