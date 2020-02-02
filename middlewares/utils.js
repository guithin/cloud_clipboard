const multiparty = require('multiparty');
const config = require('../config');

const multiPartForm = (req, res, next) => {
  const form = new multiparty.Form({
    uploadDir: config.driveTempDir
  });
  form.on('progress', (a, b) => {
    process.stdout.write('\r' + (a/b*100).toFixed(2) + '%');
  })
  form.on('error', err => console.log(err))
  form.on('close', () => console.log('close'))
  form.parse(req, (err, field, files) => {
    if (err) {
      console.log(err);
      return res.status(400).end();
    }
    req.body.formDatas = field;
    if (field.token) req.body.token = field.token[0];
    req.body.formFiles = files;
    return next();
  });
}

module.exports = {
  multiPartForm
}