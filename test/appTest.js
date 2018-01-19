let chai = require('chai');
let assert = chai.assert;
let request = require('./requestSimulator.js');
let app = require('../app.js').app;
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
      th.should_be_redirected_to(res,'/login.html');
      assert.equal(res.body,"");
      done();
    })
  })
})
describe('POST /login',()=>{
  it('redirects to homepage for valid user',done=>{
    request(app,{method:'POST',url:'/login',body:'name=ravinder'},res=>{
      th.should_be_redirected_to(res,'/home.html');
      th.should_not_have_cookie(res,'login failed');
      done();
    })
  })
  it('redirects to login for invalid user',done=>{
    request(app,{method:'POST',url:'/login',body:'name=baduser'},res=>{
      th.should_be_redirected_to(res,'/login.html');
      th.should_have_cookie(res,'logInFailed',true);
      done();
    })
  })
})
describe('GET /logout',()=>{
  it('redirects to login page',done=>{
    request(app,{method:'GET',url:'/logout'},res=>{
      th.should_be_redirected_to(res,'/login.html');
      th.should_not_have_cookie(res,'logInFailed');
      done();
    })
  })
})
describe('GET /login',()=>{
  it('serves the login page',done=>{
    request(app,{method:'GET',url:'/login.html'},res=>{
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
    request(app,{method:'GET',url:'/home.html'},res=>{
      th.status_is_ok(res);
      th.body_contains(res,'create your To-Do');
      done();
    })
  })
})
describe('GET /create', () => {
  it('responds with 404', (done) => {
    request(app,{method:'GET', url: '/create', body: '{title: "todoTitle", description: "something"}'},res=>{
      th.status_not_found(res);
      th.body_does_not_contain(res,'todoTitle');
      done();
    })
  })
  it('responds with 404', (done) => {
    request(app,{method:'GET', url: '/create', body: '{title: "", description: ""}'},res=>{
      th.status_not_found(res);
      th.body_does_not_contain(res,'todoTitle')
      done();
    })
  })
});
describe('POST /create', () => {
  it('creates a todo when title and description are given', (done) => {
    request(app,{method:'POST', url: '/create', body: '{title: "todoTitle", description: "something"}'},res=>{
      th.status_is_ok(res);
      th.body_contains(res,'todoTitle')
      done();
    })
  })
  it('redirects to home when title and description are not given', (done) => {
    request(app,{method:'POST', url: '/create', body: '{title: "", description: ""}'},res=>{
      th.body_does_not_contain(res,'todoTitle')
      done();
    })
  })
});
