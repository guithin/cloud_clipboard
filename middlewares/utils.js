const multiparty = require('multiparty');
const config = require('../config');

const multiPartForm = (req, res, next) => {
  const form = new multiparty.Form({
    uploadDir: config.driveTempDir
  });
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