let chai = require('chai');
let assert = chai.assert;
const TodoItem = require("../lib/todoItem.js");

describe('TodoItem', () => {
  beforeEach(() => {
    todoItem = new TodoItem("demo todo item");
  });
  it('should get description of the todo item', () => {
    let expectedOutput = "demo todo item";
    let actualOutput = todoItem.getDescription();
    assert.equal(expectedOutput,actualOutput);    
  });
  it('should change the description of todo', () => {
    todoItem.changeDescription("demo description");
    assert.equal(todoItem.description,"demo description");
  });
  it('should get mark done', () => {
    todoItem.getMarkDone();
    assert.isOk(todoItem.isDone);
  });
  it('should get mark undone', () => {
    todoItem.getMarkUndone();
    assert.isNotOk(todoItem.isDone);
  });
});