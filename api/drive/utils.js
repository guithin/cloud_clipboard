const dirnameValidation = (name = '') => {
  const invalidList = '\\/:*?"<>|';
  for (let i of invalidList) {
    if (name.match('\\' + i)) return false;
  }
  if (name.startsWith('.')) return false;
  return true;
}

module.exports = {
  dirnameValidation
};
