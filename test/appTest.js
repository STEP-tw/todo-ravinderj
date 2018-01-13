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
describe('POST /login',()=>{
  it('redirects to homepage',done=>{
    request(app,{method:'POST',url:'/login',body:'name=ravinder'},res=>{
      th.should_be_redirected_to(res,'/homePage.html');
      th.should_not_have_cookie(res,'login failed');
      done();
    })
  })
})
describe('POST /logout',()=>{
  it('redirects to login page',done=>{
    request(app,{method:'POST',url:'/logout'},res=>{
      th.should_be_redirected_to(res,'/loginPage.html');
      th.should_not_have_cookie(res,'login failed');
      done();
    })
  })
})
describe('GET /loginPage.html',()=>{
  it('serves the login page',done=>{
    request(app,{method:'GET',url:'/loginPage.html'},res=>{
      th.status_is_ok(res);
      th.body_contains(res,'login to create to-do');
      th.body_does_not_contain(res,'login failed');
      th.should_not_have_cookie(res,'login failed');
      done();
    })
  })
})
describe('GET /homePage.html',()=>{
  it('serves the home page',done=>{
    request(app,{method:'GET',url:'/homePage.html'},res=>{
      th.status_is_ok(res);
      th.body_contains(res,'create your To-Do');
      done();
    })
  })
})