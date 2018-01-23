let chai = require('chai');
let assert = chai.assert;
const Todo = require("../lib/todo.js");
const TodoItem = require("../lib/todoItem.js");

describe('Todo', () => {
  beforeEach(() => {
    todo = new Todo(1,"sampleTodo","demo todo for testing");
  });
  it('should get title of the todo', () => {
    let expectedOutput = "sampleTodo";
    let actualOutput = todo.getTitle();
    assert.equal(expectedOutput,actualOutput);    
  });
  it('should get description of the todo', () => {
    let expectedOutput = "demo todo for testing";
    let actualOutput = todo.getDescription();
    assert.equal(expectedOutput,actualOutput);    
  });
  it('should change the title of todo', () => {
    todo.changeTitle("demo title");
    assert.equal(todo.title,"demo title");  
  });
  it('should return id of a todo item',()=>{
    todo.addItem('sample item');
    let actualOutput = todo.getItemId();
    let expectedOutput = 1;
    assert.equal(actualOutput,expectedOutput);
  })
  it('should change the description of todo', () => {
    todo.changeDescription("demo description");
    assert.equal(todo.description,"demo description");
  });
  it('should add todo item to a todo', () => {
    todo.addItem("demo todo item");
    let expectedOutput = new TodoItem("demo todo item");
    assert.deepEqual(todo.items[1],expectedOutput);
  });
  it('should get todoItem by id', () => {
    todo.addItem("demo todo item");
    let expectedOutput = new TodoItem("demo todo item");
    let actualOutput = todo.getItem(1);
    assert.deepEqual(actualOutput,expectedOutput);
  });

});