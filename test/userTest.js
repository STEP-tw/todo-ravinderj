let chai = require('chai');
let assert = chai.assert;
const Todo = require("../lib/todo.js");
const User = require("../lib/user.js");
const TodoItem = require("../lib/todoItem.js");

describe('User', () => {
  let user = {};
  beforeEach(() => {
    user = new User("ravinder");
  });
  it('should add todo', () => {
    user.addTodo(1, "sampleTodo", "for testing");
    user.addTodo(2, "another todo", "for testing");
    let expectedOutput = {
      "1": {
        "title": "sampleTodo",
        "description": "for testing",
        "id": 1,
        "itemId": 0,
        "items": {}
      },
      "2": {
        "title": "another todo",
        "description": "for testing",
        "id": 2,
        "itemId": 0,
        "items": {}
      }
    }
    assert.deepEqual(user.todos, expectedOutput);
  });
  it('should get todo by id', () => {
    user.addTodo(1, "sampleTodo", "for testing");
    let expectedOutput = user.getTodo(1);
    let actualOutput = user.todos[1];
    assert.equal(expectedOutput, actualOutput);
  });
  it('should get todo item', () => {
    user.addTodo(1, "sampleTodo", "for testing");
    user.addItem(1, "sample todo item for tests");
    let expectedOutput = user.getItem(1, 1);
    assert.equal(user.todos[1][1], expectedOutput);
  });
  it('should delete todo', () => {
    user.addTodo(1, "sampleTodo", "for testing");
    user.deleteTodo(1);
    let expectedOutput = new User("ravinder");
    assert.deepEqual(user, expectedOutput);
  });
  it('should delete todo item', () => {
    user.addTodo(1, "sampleTodo", "sample description");
    user.addItem(1, "sample todo item");
    user.deleteItem(1, 1);
    let expectedOutput = new User("ravinder");
    expectedOutput.addTodo(1, "sampleTodo", "sample description");
    expectedOutput.todos[1].itemId = 1;
    assert.deepEqual(user, expectedOutput);
  });
  it('should get all todos', () => {
    user.addTodo(1, "sample todo", "for testing");
    user.addTodo(2, "another sample", "for testing");
    let actualOutput = user.getTodos();
    let expectedOutput = {
      "1": {
        "description": "for testing",
        "id": 1,
        "itemId": 0,
        "items": {},
        "title": "sample todo"
      },
      "2": {
        "description": "for testing",
        "id": 2,
        "itemId": 0,
        "items": {},
        "title": "another sample"
      }
    }
    assert.deepEqual(actualOutput, expectedOutput);
  });
});