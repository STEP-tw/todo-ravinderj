const fs = require('fs');
const User = require('./user.js');
const allusers = require('./dummy_users.js').allusers;
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

const getItemsList = function(todoItems){
  let items = Object.values(todoItems);
  return items.map(item=>{
    return item.description;
  });
};

const getTodoView = (title,description,todoItems) =>{
  let viewContent='';
  viewContent+=`Title: ${title}<br>`;
  viewContent+=`Description: ${description}<br><br>`;
  viewContent+=`Items:<br>${todoItems.join('<br>')}`;
  return viewContent;
}

const getTodoInfo = function(id){
  return function(title,userName){
    let titleData = {};
    titleData.todoId = id;
    titleData.title = title;
    titleData.userName = userName;
    return titleData;
  }
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

const isFile = function (fileSystem,fileName) {
  try {
    let stats = fileSystem.statSync(fileName);
    return stats.isFile();
  } catch (error) {
    return false;
  }
};

module.exports = {
  getContentType,
  getItemsList,
  getTodoView,
  getTodoInfo,
  getTodoData,
  isFile
}
