const fs = require("fs");
const UrlParser = require('./url_parser.js');
const utils = require('./lib_utils.js');
const logRequest = require('./log_request.js').logRequest;

const allusers = require('./dummy_users.js').allusers;
let registered_users = [
  { userName: 'ravinder', name: 'Ravinder Jajoria'},
  { userName: 'neeraj', name: 'Neeraj Jaiswal'}
];

const User = require("./user.js");
const Todo = require("./todo.js");

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
  if (req.method == 'GET' && utils.isFile(fs,fileName)) {
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
    res.setHeader('Set-Cookie', [`message="";Max-Age=0`, `sessionid=0;Max-Age=0`]);
    res.write("Invalid user or password!");
  }
  res.write(loginPage);
  res.end();
}


const createTodo = function (req, res) {
  let todo = req.body;
  let todoData = utils.getTodoData(req);
  res.setHeader("Content-Type", "text/json");
  res.write(JSON.stringify(todoData));
  res.end();
}


const createItem = function (req, res) {
  let text = req.body.text;
  let todoId = req.body.todoId;
  let userName = req.cookies.userName;
  allusers[userName].__proto__ = User.prototype;
  allusers[userName].todos[todoId].__proto__ = Todo.prototype;
  allusers[userName].addItem(todoId,text);
  let itemId = allusers[userName].todos[todoId].getItemId();
  let todoItem = {text: text,id: itemId, isDone:false}
  res.write(JSON.stringify(todoItem));
  res.end();
}

const deleteItem = function(req,res){
  let todoId = req.body.todoId;
  let itemId = req.body.itemId;
  let userName = req.user.userName;
  allusers[userName].__proto__ = User.prototype;
  allusers[userName].deleteItem(todoId,itemId);
  res.write('deleting item');
  res.end();
}

const editItem = function(req,res){
  res.write('edit item');
  res.end();
}

const sendTodoData = function (req, res) {
  res.setHeader("Content-Type", "application/json");
  res.write(JSON.stringify(todoData));
  res.end();
};

const sendTitleInfo = function(req,res){
  let userName = req.cookies.userName;
  let todos = allusers[userName].todos;
  let todoIDs = Object.keys(todos);
  let titlesInfo = todoIDs.map((id)=>{
    let title = todos[id].title;
    return utils.getTodoInfo(id)(title,userName);
  });
  res.setHeader("Content-Type","application/json")
  res.write(JSON.stringify(titlesInfo));
  res.end();
}

const getItemsInfo = function(todoItems){
  let itemIDs = Object.keys(todoItems);
  return itemIDs.map((id)=>{
    let itemInfo = {};
    itemInfo.id = id;
    itemInfo.text = todoItems[id].description;
    itemInfo.isDone = todoItems[id].isDone;
    return itemInfo;
  })
}

const sendItemsInfo = function(req,res){
  let todoId = req.body.todoId;
  let userName = req.cookies.userName;
  let todoItems = allusers[userName].todos[todoId].items;
  let itemsInfo = getItemsInfo(todoItems);
  res.write(JSON.stringify(itemsInfo));
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
    content = content.replace("uniq_title",todo.id);
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
  sendItemsInfo,
  todoHandler,
  deleteTodo,
  createItem,
  sendTodoData,
  createTodo,
  serveHome,
  deleteItem,
  serveLogin,
  sendTodoView,
  redirectToHomeIfLoggedin,
  editItem,
  redirectToLoginIfLoggedOut
}
