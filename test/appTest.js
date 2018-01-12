let chai = require('chai');
let assert = chai.assert;
let request = require('./requestSimulator.js');
let app = require('../server.js');
let th = require('./testHelper.js');

describe('app',()=>{
  describe('GET /bad',()=>{
    it('responds with 404',done=>{
      request(app,{method:'GET',url:'/bad'},(res)=>{
        assert.equal(res.statusCode,404);
        done();
      })
    })
  })
})
describe('GET /',()=>{
  it('redirects to login page for invalid user',done=>{
    request(app,{method:'GET',url:'/'},(res)=>{
      th.should_be_redirected_to(res,'/loginPage.html');
      assert.equal(res.body,"");
      done();
    })
  })
}) 