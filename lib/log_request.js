const fs = require("fs");
let toString = obj => JSON.stringify(obj, null, 2);
const timeStamp = require('./time.js').timeStamp;
exports.logRequest = (req, res) => {
  if(process.env.testMode){
    return;
  }
  let text = ['------------------------------',
  `${timeStamp()}`,
  `${req.method} ${req.url}`,
  `HEADERS=> ${toString(req.headers)}`,
  `COOKIES=> ${toString(req.cookies)}`,
  `BODY=> ${toString(req.body)}`, ''].join('\n');
  fs.appendFile('request.log', text, () => { });
  console.log(`${req.method} ${req.url}`);
}
