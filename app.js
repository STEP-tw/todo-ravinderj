const express = require('express');
const cookieParser = require('cookie-parser')
const lib = require("./lib/serverLIb.js");
const fs = require("fs");

const app = express();

app.use(express.urlencoded());
app.use(cookieParser());
app.get("/login",lib.serveLogin);
app.use(lib.todoHandler);
app.use(lib.loadUser);
app.use(lib.redirectToLoginIfLoggedOut);
app.use(lib.redirectToHomeIfLoggedin);
app.use(express.static('public'));
app.post("/login", lib.loginUser);
app.get("/home", lib.serveHome);
app.get("/logout", lib.logoutUser);
app.get("/titles",lib.sendTitleInfo);
app.post("/viewTodo", lib.sendTodoView);
app.delete("/deleteTodo",lib.deleteTodo);
app.post("/create", lib.createTodo);
app.post("/todoItems",lib.sendItemsInfo);
app.use((req,res,next)=>{
  lib.logRequest(fs,'request.log',req,res);
  next();
});
app.post("/addItem", lib.createItem);
app.delete("/deleteItem", lib.deleteItem);
app.put("/editItem", lib.editItem);

exports.app = app;
