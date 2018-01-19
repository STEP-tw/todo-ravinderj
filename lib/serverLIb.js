const fs = require("fs");
const timeStamp = require('./time.js').timeStamp;
const UrlParser = require('./url_parser.js');
let registered_users = [{ userName: 'ravinder', name: 'Ravinder Jajoria' }, { userName: 'neeraj', name: 'Neeraj Jaiswal' }];

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

let currentUserName = "ravinder";
let user = new User(currentUserName);

let toS = o => JSON.stringify(o, null, 2);

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

const servePage = function (req, res) {
  if (req.url == "/") {
    if (req.user)
    res.redirect("/home.html");
    res.redirect("/login.html");
    return;
  }
  let fileName = 'public' + req.url;
  if (req.method == 'GET' && isFile(fileName)) {
    res.setHeader("Content-Type", getContentType(fileName));
    let content = fs.readFileSync(fileName);
    res.write(content);
    res.end();
  }
};

let logRequest = (req, res) => {
  let text = ['------------------------------',
  `${timeStamp()}`,
  `${req.method} ${req.url}`,
  `HEADERS=> ${toS(req.headers)}`,
  `COOKIES=> ${toS(req.cookies)}`,
  `BODY=> ${toS(req.body)}`, ''].join('\n');
  fs.appendFile('request.log', text, () => { });
  // console.log(`${req.method} ${req.url}`);
}


const getContentType = function (file) {
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
  return extenstions[extn] || "text/plain";
};

const serveHomePage = function (req, res) {
  let homePage = fs.readFileSync("./templates/home.html", "utf8");
  res.setHeader("Content-Type", "text/html");
  res.write(homePage);
  res.end();
}

const saveTodoData = function (filePath, todoData) {
  fs.writeFileSync(filePath, todoData, "utf8");
}

const getTodoData = function (req) {
  let body = req.body;
  let userName = req.cookies.userName;
  let id = new Date().getTime();
  let user;
  if(!allusers.userName){
    user = new User(userName);
    user.addTodo(id, body.title, body.description);
    allusers[userName] = user;
    req.body.userName = userName;
    req.body.todoId = id;
    return req.body;
  }
  allusers[userName].addTodo(id, body.title, body.description);
  req.body.userName = userName;
  req.body.todoId = id;
  return req.body;
};

const createTodo = function (req, res) {
  let todo = req.body;
  let todoData = getTodoData(req);
  // console.log(todoData);
  res.setHeader("Content-Type", "text/json");
  res.write(JSON.stringify(todoData));
  res.end();
}

const sendTodoData = function (req, res) {
  res.setHeader("Content-Type", "application/json");
  res.write(JSON.stringify(todoData));
  res.end();
};

const sendTitleInfo = function(req,res){
  // console.log(allusers);
  let todos = allusers[req.cookies.userName].todos;
  let todoIDs = Object.keys(todos);
  let titlesInfo = todoIDs.map((id)=>{
    let titleData = {};
    titleData.todoId = id;
    titleData.title = todos[id].title;
    titleData.userName = req.cookies.userName;
    return titleData;
  });
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
  // console.log(req.cookies);
  let url = req.url;
  let parser = new UrlParser(url);
  if(parser.isValidUrl()){
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
  // console.log("deleting",todoId,req.cookies.userName);
  res.write("deleting todo");
  res.end();
}

const loginUser = (req, res) => {
  let user = registered_users.find(u => u.userName == req.body.name);
  if (!user) {
    res.setHeader('Set-Cookie', `logInFailed=true`);
    res.setHeader("Content-Type", "text/html");
    res.redirect('/login.html');
    return;
  }
  let sessionid = new Date().getTime();
  res.setHeader('Set-Cookie', [`sessionid=${sessionid}`,`userName=${req.body.name}`]);
  user.sessionid = sessionid;
  res.redirect('/home.html');
};

const logoutUser = (req, res) => {
  res.setHeader('Set-Cookie', [`logInFailed=false;Max-Age=0`, `sessionid=0;Max-Age=0`]);
  res.redirect('/login.html');
};

const getTodoView = (title,description,todoItems) =>{
  let viewContent='';
  viewContent+=`Title: ${title}<br>`;
  viewContent+=`Description: ${description}<br><br>`;
  viewContent+=`Items:<br>${todoItems.join('<br>')}`;
  return viewContent;
}

const getItemsList = function(todoItems){
  let items = Object.values(todoItems);
  return items.map(item=>{
    return item.description;
  });
}

const sendTodoView = (req,res)=>{
  let userName = req.cookies.userName;
  let todoId = req.body.todoId;
  let todo = allusers[userName].todos[todoId];
  let title = todo.title;
  let description = todo.description;
  let todoItems = getItemsList(todo.items);
  let viewContent = getTodoView(title,description,todoItems);
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
  serveHomePage,
  sendTodoView
}
