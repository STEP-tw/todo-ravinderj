const assert = require('chai').assert;
const Fs = require('../lib/mock_fs.js');

describe('mockFs',()=>{
  describe('#addFile',()=>{
    it('should add a file',()=>{
      let fs = new Fs();
      fs.addFile('hello.txt','hello world');
      let actualOutput = fs;
      let expectedOutput = {
        files : {
          "hello.txt" : "hello world"
        }
      };
      assert.deepEqual(actualOutput,expectedOutput);
    })
  })
  describe('#existsSync',()=>{
    it('should return true if file exists',()=>{
      let fs = new Fs();
      fs.addFile('hello.txt','hello world');
      assert.isOk(fs.existsSync('hello.txt'));
    })
    it('should return false if file doesn\' exist',()=>{
      let fs = new Fs();
      assert.isNotOk(fs.existsSync('hello.txt'));
    })
  })
  describe('#readFileSync',()=>{
    it('should read the file if file exists',()=>{
      let fs = new Fs();
      fs.addFile('hello.txt','hello world');
      let actualOutput = fs.readFileSync('hello.txt');
      let expectedOutput = 'hello world';
      assert.equal(actualOutput,expectedOutput);
    })
    it('should throw an error with an error message if file doesn\'t exist',()=>{
      let fs = new Fs();
      try{
        let actualOutput = fs.readFileSync('hello.txt');
      }catch(e){
        assert.isOk(e instanceof Error);
        assert.equal(e.message,'File not found');
      }
    })
  })
  describe('#appendFile',()=>{
    let fs = new Fs();
    fs.addFile('hello.txt','hello world');
    fs.appendFile('hello.txt',' how are you');
    let actualOutput = fs.readFileSync('hello.txt');
    let expectedOutput = 'hello world how are you';
    assert.equal(actualOutput,expectedOutput);
  })
})