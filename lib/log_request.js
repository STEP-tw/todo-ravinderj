let toString = obj => JSON.stringify(obj, null, 2);
const timeStamp = require('./time.js').timeStamp;
exports.logRequest = (fs,fileName,req, res) => {
  let text = ['------------------------------',
  `${timeStamp()}`,
  `${req.method} ${req.url}`,
  `HEADERS=> ${toString(req.headers)}`,
  `COOKIES=> ${toString(req.cookies)}`,
  `BODY=> ${toString(req.body)}`, ''].join('\n');  
  fs.appendFile(fileName, text, () => { });
  console.log(`${req.method} ${req.url}`);
}
