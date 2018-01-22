const Todo = require("./todo.js");

class User{
  constructor(name){
    this.name = name;
    this.todos = {};
  }
  getTodo(id){
    return this.todos[id];
  }
  addTodo(id,title,description){
    this.todos[id] = new Todo(id,title,description);
    return this.todos;
  }
  getItem(todoId,itemId){
    let todo = this.getTodo(todoId);
    return todo.getItem(itemId);
  }
  addItem(todoId,description){
    let todo = this.getTodo(todoId);
    todo.addItem(description);
  }
  editItem(todoId,itemId,text){
    let todo = this.getTodo(todoId);
    todo.editItem(itemId,text)
  }
  deleteTodo(todoId){
    delete this.todos[todoId];
  }
  deleteItem(todoId,itemId){
    delete this.todos[todoId].items[itemId];
  }
  getTodos(){
    return this.todos;
  }
}

module.exports = User;
