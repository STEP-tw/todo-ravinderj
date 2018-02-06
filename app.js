const express = require('express');
const cookieParser = require('cookie-parser')
const lib = require("./lib/serverLIb.js");
const fs = require("fs");

const app = express();

app.sessionidGenerator = function(){
  return new Date().getTime();
}

app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(lib.loadUser);
app.use(lib.todoHandler);
app.use(lib.redirectToLoginIfLoggedOut);
app.use(lib.redirectToHomeIfLoggedin);
app.use(express.static('public'));
app.get("/home", lib.serveHome);
app.get("/titles",lib.sendTitleInfo);
app.get("/login.html",lib.serveLogin);
app.post("/login.html", lib.loginUser.bind(app));
app.get("/logout", lib.logoutUser);
app.post("/viewTodo", lib.sendTodoView);
app.delete("/deleteTodo",lib.deleteTodo);
app.post("/create", lib.createTodo);
app.post("/todoItems",lib.sendItemsInfo);
app.use((req,res,next)=>{
  lib.logRequest(fs,'request.log',req,res);
  next();
});
app.delete("/deleteItem", lib.deleteItem);
app.put("/editItem", lib.editItem);
app.post("/addItem", lib.createItem);

exports.app = app;
