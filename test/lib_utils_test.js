const chai = require('chai');
const assert = chai.assert;
const lib = require('../lib/lib_utils.js');

describe('lib_utils',()=>{
  describe('#getContentType',()=>{
    it('should return the content type of file if extension is there',()=>{
      assert.equal(lib.getContentType('index.html'),'text/html');
      assert.equal(lib.getContentType('index.js'),'text/javascript');
    })
    it('should return content type as text/plain if file doesn\'t have extension',()=>{
      assert.equal(lib.getContentType('index'),'text/plain');
      assert.equal(lib.getContentType('file'),'text/plain');
    })
    it('should return content type as text/plain if file has invalid extension',()=>{
      assert.equal(lib.getContentType('index.abc'),'text/plain');
      assert.equal(lib.getContentType('file.xyz'),'text/plain');
    })
  })
  describe('#getItemsList',()=>{
    it('should return description of todo items if they are present',()=>{
      let todoItems = {
        "1": {description:"first"},
        "2": {description:"second"},
        "3": {description:"third"}
      }
      assert.deepEqual(lib.getItemsList(todoItems),['first','second','third']);
    })
    it('should return array of undefined if items don\'t have description',()=>{
      let todoItems = {"1": {},"2": {},"3": {}};
      assert.deepEqual(lib.getItemsList(todoItems),[undefined,undefined,undefined]);
    })
    it('should return an empty array if items aren\'t present',()=>{
      let todoItems = {};
      assert.deepEqual(lib.getItemsList(todoItems),[]);
    })
  })
  describe('#getTodoView',()=>{
    it('should return todo in html format',()=>{
      let actualOutput = lib.getTodoView("todo","sample todo",['first','second']);
      let expectedOutput = 'Title: todo<br>Description: sample todo<br><br>Items:<br>first<br>second';
      assert.equal(actualOutput, expectedOutput);
    })
  })
  describe('#getTodoInfo',()=>{
    it('should return info that has id, title and user name',()=>{
      let getInfoOfTodo1 = lib.getTodoInfo(1);
      let actualOutput = getInfoOfTodo1('sample','ravinder');
      let expectedOutput = {
        todoId:1,
        title: "sample",
        userName: "ravinder"
      };
      assert.deepEqual(actualOutput,expectedOutput);
    })
  })
  describe('#getTodoData',()=>{
    it('should return todo details',done=>{
      let req = {
        cookies: {
          userName: "ravinder"
        },
        body: {
          title: 'Todo',
          description : 'Todo for todo'
        }
      }
      let todoData = lib.getTodoData(req);
      assert.equal(todoData.userName,'ravinder');
      assert.equal(todoData.title,'Todo');
      assert.equal(todoData.description,'Todo for todo');
      done();
    })
    it('should create new user if user is not there and should return todo data',done=>{
      let req = {
        cookies: {
          userName: "manish"
        },
        body: {
          title: 'Todo',
          description : 'Todo for todo'
        }
      }
      let todoData = lib.getTodoData(req);
      assert.equal(todoData.userName,'manish');
      assert.equal(todoData.title,'Todo');
      assert.equal(todoData.description,'Todo for todo');
      done();
    })
  })
  describe('#isFile',()=>{
    let fs;
    let file;
    beforeEach(()=>{
      file = "index.js";
      fs = {
        statSync: (fileName)=>{
          return {
            isFile: ()=>{
              return (fileName==file) ? true : false;
            }
          }
        }
      }
    })
    it('should return true if file exists',()=>{
    assert.isOk(lib.isFile(fs,"index.js"));
    })
    it('should return false if file doesn\'t exist',()=>{
    assert.isNotOk(lib.isFile(fs,"home.js"));
    })
  })
})
