const router = require('express').Router();
const { userChecker } = require('../../middlewares/auth2');
const { permissionChecker, permCheckFromStr } = require('../../middlewares/drivePermission');
const { drivePath } = require('../../config');
const fs = require('fs');
const path = require('path');
const rimarf = require('rimraf');
const { dirnameValidation } = require('./utils');

const commandRm = (req, res) => {
  let reqPath, files;
  try {
    reqPath = path.join(drivePath, decodeURIComponent(req.path));
    files = JSON.parse(req.body.command);
  }
  catch (err) {
    console.log(err);
    return res.status(400).end();
  }
  for (let i in files) {
    if (!dirnameValidation(files[i])) continue;
    try {
      const item = path.join(reqPath, files[i]);
      const isDir = fs.lstatSync(item).isDirectory();
      if (isDir) {
        rimarf.sync(item);
      }
      else {
        fs.unlinkSync(item);
      }
    }
    catch (err) {
      console.log(err);
      return res.status(400).end();
    }
  }
  return res.send({
    path: req.path,
    command: '',
  })
}

const commandMkdir = (req, res) => {
  try {
    const reqPath = path.join(drivePath, decodeURIComponent(req.path));
    const dirname = req.body.command;
    if (!dirnameValidation(dirname)) return res.status(400).end('invalid file name.');
    fs.mkdirSync(path.join(reqPath, dirname));
  }
  catch (err) {
    console.log(err);
    return res.status(400).end();
  }
  return res.send({
    path: req.path,
    command: '',
  })
}

const commandMv = async (req, res) => {
  try {
    const reqPath = path.join(drivePath, decodeURIComponent(req.path));
    const command = JSON.parse(req.body.command);
    const movePath = command.movePath;
    const result = await permCheckFromStr('w')(req, movePath);
    if (!result || result.level !== 2) {
      return res.status(403).end('permissionDenied');
    }
    fs.renameSync(path.join(reqPath, command.item), path.join(drivePath, movePath));
  }
  catch (err) {
    console.log(err);
    return res.status(400).end();
  }
  return res.send({
    path: req.path,
    command: '',
  })
}

const funcMap = {
  rm: commandRm,
  mkdir: commandMkdir,
  mv: commandMv
}

router.post('/*', userChecker(true), permissionChecker('w'), (req, res) => {
  const fetchFunc = funcMap[req.body.type];
  if (!fetchFunc) {
    return res.status(400).end();
  }
  return fetchFunc(req, res);
});

module.exports = router;
