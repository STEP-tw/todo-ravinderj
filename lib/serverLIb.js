const fs = require("fs");
const UrlParser = require('./url_parser.js');
const utils = require('./lib_utils.js');
const logRequest = require('./log_request.js').logRequest;
let registered_users = [
  { userName: 'ravinder', name: 'Ravinder Jajoria'},
  { userName: 'neeraj', name: 'Neeraj Jaiswal'}
];

const User = require("./user.js");
const Todo = require("./todo.js");
const allusers = {
  "ravinder": {
    todos: {
      "123456": {
        title: "uniq",
        description: "todo for uniq",
        items: {
          "1": {
            description: "adding basic functionalities",
            isDone: true
          },
          "2": {
            description: "extra functionalities",
            isDone: false
          }
        }
      },
      "123457": {
        title: "sort",
        description: "todo for sort",
        items: {
          "1": {
            description: "adding basic functionalities",
            isDone: true
          },
          "2": {
            description: "extra functionalities",
            isDone: false
          }
        }
      }
    }
  }
};

const isFile = function (fileName) {
  try {
    let stats = fs.statSync(fileName);
    return stats.isFile();
  } catch (error) {
    return false;
  }
};

let loadUser = (req, res) => {
  let sessionid = req.cookies.sessionid;
  let user = registered_users.find(u => u.sessionid == sessionid);
  if (sessionid && user) {
    req.user = user;
  }
};

const redirectToLoginIfLoggedOut=(req,res)=>{
  if(req.urlIsOneOf(['/home','/']) && !req.user) res.redirect('/login');
}

const redirectToHomeIfLoggedin=(req,res)=>{
  if(req.urlIsOneOf(['/','/login']) && req.user) res.redirect('/home');
}

const servePage = function (req, res) {
  let fileName = 'public' + req.url;
  if (req.method == 'GET' && isFile(fileName)) {
    res.setHeader("Content-Type", utils.getContentType(fileName));
    let content = fs.readFileSync(fileName);
    res.write(content);
    res.end();
  }
};

const serveHome = function (req, res) {
  let homePage = fs.readFileSync("./templates/home.html", "utf8");
  res.setHeader("Content-Type", "text/html");
  res.write(homePage);
  res.end();
}

const serveLogin = function (req, res) {
  let loginPage = fs.readFileSync("./public/login.html", "utf8");
  res.setHeader("Content-Type", "text/html");
  if(req.cookies.message){
    console.log(req.cookies);
    res.setHeader('Set-Cookie', [`message="";Max-Age=0`, `sessionid=0;Max-Age=0`]);
    res.write("Invalid user or password!");
  }
  res.write(loginPage);
  res.end();
}

const getTodoData = function (req) {
  let body = req.body;
  let userName = req.cookies.userName;
  let id = new Date().getTime();
  let user;
  if(!allusers[userName]){
    user = new User(userName);
    allusers[userName] = user;
  }
  allusers[userName].__proto__ = User.prototype;
  allusers[userName].addTodo(id, body.title, body.description);
  body.userName = userName;
  body.todoId = id;
  return body;
};

const createTodo = function (req, res) {
  let todo = req.body;
  let todoData = getTodoData(req);
  res.setHeader("Content-Type", "text/json");
  res.write(JSON.stringify(todoData));
  res.end();
}

const sendTodoData = function (req, res) {
  res.setHeader("Content-Type", "application/json");
  res.write(JSON.stringify(todoData));
  res.end();
};

const getTitleInfo = function(id){
  return function(todos,userName){
    let titleData = {};
    titleData.todoId = id;
    titleData.title = todos[id].title;
    titleData.userName = userName;
    return titleData;
  }
}

const sendTitleInfo = function(req,res){
  let userName = req.cookies.userName;
  let todos = allusers[userName].todos;
  let todoIDs = Object.keys(todos);
  let titlesInfo = todoIDs.map((id)=>getTitleInfo(id)(todos,userName));
  res.setHeader("Content-Type","application/json")
  res.write(JSON.stringify(titlesInfo));
  res.end();
}

const sendTodoItem = function (req, res) {
  let todoItem = req.body;
  res.write(JSON.stringify(todoItem));
  res.end();
}

const todoHandler = function(req,res){
  let url = req.url;
  let parser = new UrlParser(url);
  if(parser.isValidUrl() && req.user){
    let todoInfo = parser.parse();
    let todo = allusers[todoInfo.userName].todos[todoInfo.todoId];
    let content = fs.readFileSync("templates/todo_template.html","utf8");
    content = content.replace("${title}",todo.title);
    content = content.replace("${description}",todo.description);
    res.setHeader("Content-Type","text/html");
    res.write(content);
    res.end();
  }
}

const deleteTodo = function(req,res){
  let todoId = req.body.todoId;
  let userName = req.cookies.userName;
  delete allusers[userName].todos[todoId];
  res.write("deleting todo");
  res.end();
}

const loginUser = (req, res) => {
  let user = registered_users.find(u => u.userName == req.body.name);
  if (!user) {
    res.setHeader('Set-Cookie', `message=logInFailed`);
    res.setHeader("Content-Type", "text/html");
    res.redirect('/login');
    return;
  }
  let sessionid = new Date().getTime();
  res.setHeader('Set-Cookie', [`sessionid=${sessionid}`,`userName=${req.body.name}`]);
  user.sessionid = sessionid;
  res.redirect('/home');
};

const logoutUser = (req, res) => {
  res.setHeader('Set-Cookie', [`message="";Max-Age=0`, `sessionid=0;Max-Age=0`,`userName="";Max-Age=0`]);
  res.redirect('/login');
};

const sendTodoView = (req,res)=>{
  let userName = req.cookies.userName;
  let todoId = req.body.todoId;
  let todo = allusers[userName].todos[todoId];
  let title = todo.title;
  let description = todo.description;
  let todoItems = utils.getItemsList(todo.items);
  let viewContent = utils.getTodoView(title,description,todoItems);
  res.write(viewContent);
  res.end();
}

module.exports = {
  logRequest,
  loadUser,
  servePage,
  logoutUser,
  loginUser,
  sendTitleInfo,
  todoHandler,
  deleteTodo,
  sendTodoItem,
  sendTodoData,
  createTodo,
  serveHome,
  serveLogin,
  sendTodoView,
  redirectToHomeIfLoggedin,
  redirectToLoginIfLoggedOut
}
