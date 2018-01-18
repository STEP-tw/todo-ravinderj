const TodoItem = require("./todoItem.js");

class Todo{
  constructor(id,title,description){
    this.id = id;
    this.title = title;
    this.description = description;
    this.itemId = 0;
    this.items = {};
  }
  getTitle(){
    return this.title;
  }
  getDescription(){
    return this.description;
  }
  addItem(description){
    let todoItem = new TodoItem(description);
    this.itemId++;
    this.items[this.itemId] = todoItem;
  }
  changeTitle(newTitle){
    this.title = newTitle;
  }
  changeDescription(newDescription){
    this.description = newDescription;
  }
  getItem(todoItemName){
    return this.items[todoItemName];
  }
}

module.exports = Todo;