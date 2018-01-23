const assert = require("chai").assert;
const Fs = require('../lib/mock_fs.js');
const logRequest = require('../lib/log_request.js').logRequest;

describe('logRequest',()=>{
  it('should append the data to the file',()=>{
    let req = {
      url: "/home",
      method: "GET",
      headers: "text",
      body: "",
      cookies: ""
    }
    let res = {};
    let fs = new Fs();
    fs.addFile('hello.txt','hello world');    
    logRequest(fs,'hello.txt',req,res);
    let helloFile = fs.readFileSync('hello.txt');
    assert.include(helloFile,'GET /home');
    assert.include(helloFile,'HEADERS=> "text"');
    assert.include(helloFile,'COOKIES=> ');
    assert.include(helloFile,'BODY=> ');
  })
})
