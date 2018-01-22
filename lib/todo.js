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
  getItem(itemId){
    return this.items[itemId];
  }
  getItemId(){
    return this.itemId;
  }
  editItem(itemId,text){
    let item = this.getItem(itemId);
    item.changeDescription(text);
  }
}

module.exports = Todo;