const User = require("./user.js");

class Users{
  constructor(){
    this.allUsers = {};
  }
  getUser(userName){
    return this.allUsers[userName];
  }
  addUser(user){
    this.allUsers[user.name] = user;
  }
  getTodo(userName,todoName){
    let user = this.getUser(userName);
    return user.getTodo(todoName);
  }
  addTodo(userName,todo){
    this[userName].todos.push(todo);
  }
  addTodoItem(userName,todoName,todoItem){
    let todo = this.getTodo(userName,todoName);
    todo.addItem(todoItem);
  }
  getUser(userName){
    return this[userName];
  }
  getUserTodos(userName){
    let user = getUser(userName);
    return user.getTodos();
  }
  getAllUsers(){
    return this.allUsers;
  }
}

module.exports = Users;