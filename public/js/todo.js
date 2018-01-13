const User = class{
  constructor(name){
    this.name = name;
    this.todos = {};
  }
  addTodo(todo){
    let todoId = todo.id;
    this.todos[todoId] = todo;
  }
  deleteTodo(todoId){
    delete this.todos[todoId];
  }
}




/////////////////////////////////////////

const Todo = class {
  constructor(title,description){
    this.id = new Date().getTime();
    this.title = title;
    this.description = description;
    this.todoItems = {};
  }
  addTodoItem(todoItem){
    let name = todoItem.name;
    this.todoItems[name] = todoItem;
  }
  changeTodoTitle(title){
    this.title = title;
  }
  getTodoItem(todoItemName){
    return this.todoItems[todoItemName];
  }
}





//////////////////////////////////////////

const TodoItem = class {
  constructor(description){
    this.description = description;
    this.done = false;
  }
  getDescription(){
    return this.description;
  }
  changeDescription(description){
    this.description = description;
  }
  getMarkDone(){
    this.done = true;
  }
  getMarkUndone(){
    this.done = false;
  }
}

exports.User = User;
exports.Todo = Todo;
exports.TodoItem = TodoItem;
