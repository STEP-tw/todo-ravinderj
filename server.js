let fs = require('fs');
const http = require('http');
const timeStamp = require('./time.js').timeStamp;
const WebApp = require('./webapp');
let homePage = fs.readFileSync('./templates/homePage.html',"utf8");
let todoData = fs.readFileSync("./data/todoData.json");
todoData = JSON.parse(todoData);
let registered_users = [{userName:'ravinder',name:'Ravinder Jajoria'},{userName:'neeraj',name:'Neeraj Jaiswal'}];

const User = require("./public/js/todo.js").User;
const Todo = require("./public/js/todo.js").Todo;

let toS = o=>JSON.stringify(o,null,2);

const isFile = function (fileName) {
  try {
    let stats = fs.statSync(fileName);
    return stats.isFile();
  } catch (error) {
    return false;
  }
};

let loadUser = (req,res)=>{
  let sessionid = req.cookies.sessionid;
  let user = registered_users.find(u=>u.sessionid==sessionid);
  if(sessionid && user){
    req.user = user;
  }
};

const servePage = function (req, res) {
  if(req.url == "/"){
    req.url = (req.user) ? res.redirect("/homePage.html") : res.redirect("/loginPage.html");
  }
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

const serveHomePage = function(req,res){
  let createTodoForm = fs.readFileSync("./templates/createTodo.html");
  let todoPage = homePage.replace(/TODO_WORKSPACE/,createTodoForm);
  res.setHeader("Content-Type","text/html");
  res.write(todoPage);
  res.end();
}

const saveTodoData = function(filePath,todoData){
  fs.writeFileSync(filePath,todoData,"utf8");
}

const getTodoData = function(req){
  let body = req.body;
  let currentUserName = req.user.userName;
  let user = new User(currentUserName);
  let todo = new Todo(body.title,body.description);
  user.addTodo(todo);
  let todoData = {};
  todoData[currentUserName] = user;
  return JSON.stringify(todoData,null,2);
};

const handleTodoItem = function(req,res,filePath){
  let body = req.body;
  if(body.title && body.description){
    let todoData = getTodoData(req);
    saveTodoData(filePath,todoData);
    res.end();
  }
  res.redirect("/homePage.html")
  res.end();
}

const sendData = function(req,res){
  res.setHeader("Content-Type","application/json");
  res.write(JSON.stringify(todoData));
  res.end();
};

const loginUser = (req,res)=>{
  console.log(req.body);
  let user = registered_users.find(u=>u.userName==req.body.name);
  if(!user) {
    res.setHeader('Set-Cookie',`logInFailed=true`);
    res.setHeader("Content-Type","text/html");
    res.redirect('/loginPage.html');
    return;
  }
  let sessionid = new Date().getTime();
  res.setHeader('Set-Cookie',`sessionid=${sessionid}`);
  user.sessionid = sessionid;
  res.redirect('/homePage.html');
};

const logoutUser = (req,res)=>{
  res.setHeader('Set-Cookie',[`logInFailed=false;Max-Age=0`,`sessionid=0;Max-Age=0`]);
  res.redirect('/loginPage.html');
};

let app = WebApp.create();
app.use(logRequest);
app.use(loadUser);
app.use(servePage);
app.get("/homePage.html",serveHomePage);
app.post("/create",(req,res)=>handleTodoItem(req,res,"data/todoData.json"));
app.post("/data",sendData);
app.post("/login",loginUser);
app.post("/logout",logoutUser)

const PORT = 8000;
let server = http.createServer(app);
server.on('error',e=>console.error('**error**',e.message));
server.listen(PORT,(e)=>console.log(`server listening at ${PORT}`));

module.exports = app;