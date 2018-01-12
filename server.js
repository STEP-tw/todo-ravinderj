let fs = require('fs');
const http = require('http');
const timeStamp = require('./time.js').timeStamp;
const WebApp = require('./webapp');

let toS = o=>JSON.stringify(o,null,2);

const isFile = function (fileName) {
  try {
    let stats = fs.statSync(fileName);
    return stats.isFile();
  } catch (error) {
    return false;
  }
};

const serveFile = function (req, res) {
  if(req.url=="/") req.url = "/index.html";
  let fileName = 'public' + req.url;
  if (req.method == 'GET' && isFile(fileName)) {
    res.setHeader("Content-Type",getContentType(fileName));
    let content = fs.readFileSync(fileName);
    res.write(content);
    res.end();
  }
};

let logRequest = (req,res)=>{
  let text = ['------------------------------',
  `${timeStamp()}`,
  `${req.method} ${req.url}`,
  `HEADERS=> ${toS(req.headers)}`,
  `COOKIES=> ${toS(req.cookies)}`,
  `BODY=> ${toS(req.body)}`,''].join('\n');
  fs.appendFile('request.log',text,()=>{});
  console.log(`${req.method} ${req.url}`);
}


const getContentType = function(file) {
  let extn = file.slice(file.lastIndexOf("."));
  let extenstions = {
    ".js": "text/javascript",
    ".json": "application/json",
    ".gif": "image/gif",
    ".jpg": "image/jpg",
    ".html": "text/html",
    ".css": "text/css",
    ".pdf": "application/pdf"
  }
  if(!extenstions[extn]){
    return "text/plain";
  }
  return extenstions[extn];
};

const respondWith404 = function(req,res){
  res.statusCode = 404;
  res.write("not found");
  res.end();
}

let app = WebApp.create();
app.use(logRequest);
app.use(serveFile);
app.use(respondWith404);

const PORT = 5000;
let server = http.createServer(app);
server.on('error',e=>console.error('**error**',e.message));
server.listen(PORT,(e)=>console.log(`server listening at ${PORT}`));

module.exports = app;