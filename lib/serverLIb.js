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
const TodoItem = require("./todoItem.js");

let urlIsOneOf = function(urls){
  return urls.includes(this.url);
}


let loadUser = (req, res,next) => {
  let sessionid = req.cookies.sessionid;
  let user = registered_users.find(u => u.sessionid == sessionid);
  
  if (sessionid && user) {
    req.user = user;
  }
  next();
};

const redirectToLoginIfLoggedOut=(req,res,next)=>{
  req.urlIsOneOf = urlIsOneOf.bind(req);
  if(req.urlIsOneOf(['/home','/','/titles']) && !req.user)
  res.redirect('/login.html');
  next();
}

const redirectToHomeIfLoggedin=(req,res,next)=>{
  req.urlIsOneOf = urlIsOneOf.bind(req);
  if(req.urlIsOneOf(['/','/login.html']) && req.user)
  res.redirect('/home');
  next();
}

const servePage = function (req, res,next) {
  let fileName = 'public' + req.url;
  if (req.method == 'GET' && utils.isFile(fs,fileName)) {
    res.setHeader("Content-Type", utils.getContentType(fileName));
    let content = fs.readFileSync(fileName);
    res.send(content);
  }
  next();
};

const serveHome = function (req, res,next) {
  let homePage = fs.readFileSync("./templates/home.html", "utf8");
  res.setHeader("Content-Type", "text/html");
  res.send(homePage);
  next()
}

const serveLogin = function (req, res,next) {
  let loginPage = fs.readFileSync("./public/login.html", "utf8");
  res.setHeader("Content-Type", "text/html");
  if(req.cookies.message){
    res.cookie("message","",{"Max-Age":0});
    res.cookie("sessionid",0,{"Max-Age":0});
    res.send("Invalid user or password!");
  }
  res.send(loginPage);
  next();
}


const createTodo = function (req, res) {
  let todo = req.body;
  let todoData = utils.getTodoData(req);
  res.setHeader("Content-Type", "text/json");
  res.send(JSON.stringify(todoData));
}


const createItem = function (req, res) {
  let text = req.body.text;
  let todoId = req.body.todoId;
  let userName = req.cookies.userName;
  allusers[userName].__proto__ = User.prototype;
  allusers[userName].getTodo(todoId).__proto__ = Todo.prototype;
  allusers[userName].addItem(todoId,text);
  let itemId = allusers[userName].todos[todoId].getItemId();
  console.log(text);
  console.log(itemId);
  let todoItem = {text: text,id: itemId, isDone:false};
  res.send(JSON.stringify(todoItem));
}

const deleteItem = function(req,res){
  let todoId = req.body.todoId;
  let itemId = req.body.itemId;
  let userName = req.user.userName;
  allusers[userName].__proto__ = User.prototype;
  allusers[userName].deleteItem(todoId,itemId);
  res.send('deleting item')
}

const editItem = function(req,res){
  let text = req.body.newText;
  let todoId = req.body.todoId;
  let itemId = req.body.itemId;
  let userName = req.cookies.userName;
  allusers[userName].__proto__ = User.prototype;
  allusers[userName].getTodo(todoId).__proto__ = Todo.prototype;
  allusers[userName].getItem(todoId,itemId).__proto__ = TodoItem.prototype;
  allusers[userName].editItem(todoId,itemId,text);
  res.send('editing an item');
}

const sendTodoData = function (req, res) {
  res.setHeader("Content-Type", "application/json");
  res.send(JSON.stringify(todoData));
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
  res.send(JSON.stringify(titlesInfo));
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
  res.send(JSON.stringify(itemsInfo));
}

const todoHandler = function(req,res,next){
  let url = req.url;
  let parser = new UrlParser(url);
  if(parser.isValidUrl() && !req.user){
    let todoInfo = parser.parse();
    let todo = allusers[todoInfo.userName].todos[todoInfo.todoId];
    let content = fs.readFileSync("templates/todo_template.html","utf8");
    content = content.replace("${title}",todo.title);
    content = content.replace("uniq_title",todo.id);
    content = content.replace("${description}",todo.description);    
    res.setHeader("Content-Type","text/html");
    res.send(content);
  }
  next();
}

const deleteTodo = function(req,res){
  let todoId = req.body.todoId;
  let userName = req.cookies.userName;
  delete allusers[userName].todos[todoId];
  res.send("deleting todo");
}

const loginUser = (req, res) => {
  let user = registered_users.find(u => u.userName == req.body.name);
  if (!user) {
    res.cookie("message","logInFailed");
    res.redirect('/login.html');
    return;
  }
  let sessionid = new Date().getTime();
  res.cookie("sessionid",`${sessionid}`);
  res.cookie("userName",`${req.body.name}`);
  user.sessionid = sessionid;
  res.redirect('/home');
};

const logoutUser = (req, res) => {
  res.clearCookie("message");
  res.clearCookie("sessionid");
  res.clearCookie("userName");
  res.redirect('/login.html');
};

const sendTodoView = (req,res)=>{
  let userName = req.cookies.userName;
  let todoId = req.body.todoId;
  let todo = allusers[userName].todos[todoId];
  let title = todo.title;
  let description = todo.description;
  let todoItems = utils.getItemsList(todo.items);
  let viewContent = utils.getTodoView(title,description,todoItems);
  res.send(viewContent);
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
