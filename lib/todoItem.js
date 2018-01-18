class TodoItem{
  constructor(description){
    this.description = description;
    this.isDone = false;
  }
  getDescription(){
    return this.description;
  }
  changeDescription(description){
    this.description = description;
  }
  getMarkDone(){
    this.isDone = true;
  }
  getMarkUndone(){
    this.isDone = false;
  }
}

module.exports = TodoItem;