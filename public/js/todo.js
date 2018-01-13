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
  constructor(name,description){
    this.name = name;
    this.description = description;
    this.tag = "undone";
  }
  getDescription(){
    return this.description;
  }
  changeName(name){
    this.name = name;
  }
  changeDescription(description){
    this.description = description;
  }
  getMarkDone(){
    this.tag = "done";
  }
  getMarkUndone(){
    this.tag = "undone";
  }
}

exports.User = User;
exports.Todo = Todo;
exports.TodoItem = TodoItem;
