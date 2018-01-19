let chai = require('chai');
let assert = chai.assert;
let request = require('./requestSimulator.js');
let app = require('../app.js').app;
let th = require('./testHelper.js');

describe('app', () => {
  describe('GET /bad', () => {
    it('responds with 404', done => {
      request(app, { method: 'GET', url: '/bad' }, (res) => {
        assert.equal(res.statusCode, 404);
        done();
      })
    })
  })
  describe('GET /', () => {
    it('redirects to login for invalid user', done => {
      request(app, { method: 'GET', url: '/' }, (res) => {
        th.should_be_redirected_to(res, '/login');
        assert.equal(res.body, "");
        done();
      })
    })
  })
  describe('POST /login', () => {
    it('redirects to home for valid user', done => {
      request(app, { method: 'POST', url: '/login', body: 'name=ravinder' }, res => {
        th.should_be_redirected_to(res, '/home');
        th.should_not_have_cookie(res, 'login failed');
        done();
      })
    })
    it('redirects to login for invalid user', done => {
      request(app, { method: 'POST', url: '/login', body: 'name=baduser' }, res => {
        th.should_be_redirected_to(res, '/login');
        th.should_have_cookie(res, 'message', "logInFailed");
        done();
      })
    })
  })
  describe('GET /logout', () => {
    it('redirects to login after logout', done => {
      request(app, { method: 'GET', url: '/logout' }, res => {
        th.should_be_redirected_to(res, '/login');
        th.should_not_have_cookie(res, 'logInFailed');
        done();
      })
    })
  })
  describe('GET /login', () => {
    it('serves the login page', done => {
      request(app, { method: 'GET', url: '/login' }, res => {
        th.status_is_ok(res);
        th.body_contains(res, 'login to create to-do');
        th.body_does_not_contain(res, 'login failed');
        th.should_not_have_cookie(res, 'login failed');
        done();
      })
    })
  })
  describe('GET /home', () => {
    it('serves the home page', done => {
      request(app, { method: 'GET', url: '/home' }, res => {
        th.status_is_ok(res);
        th.body_contains(res, 'create your To-Do');
        done();
      })
    })
  })
  describe('GET /create', () => {
    it('responds with 404', (done) => {
      request(app, { method: 'GET', url: '/create', body: '{title: "todoTitle", description: "something"}' }, res => {
        th.status_not_found(res);
        th.body_does_not_contain(res, 'todoTitle');
        done();
      })
    })
    it('responds with 404', (done) => {
      request(app, { method: 'GET', url: '/create', body: '{title: "", description: ""}' }, res => {
        th.status_not_found(res);
        th.body_does_not_contain(res, 'todoTitle')
        done();
      })
    })
  });
  describe('POST /create', () => {
    it('creates a todo when title and description are given', (done) => {
      request(app, { method: 'POST', url: '/create', body: '{title: "todoTitle", description: "something"}' }, res => {
        th.status_is_ok(res);
        th.body_contains(res, 'todoTitle')
        done();
      })
    })
    it('redirects to home when title and description are not given', (done) => {
      request(app, { method: 'POST', url: '/create', body: '{title: "", description: ""}' }, res => {
        th.body_does_not_contain(res, 'todoTitle')
        done();
      })
    })
  })
  describe("POST /viewTodo",()=>{
    it('shows a todo once user has clicked on view button',done=>{
      request(app,{method:'POST',url:'/viewTodo',body:'todoId=123456',headers:{cookie:"userName=ravinder"}},res=>{
        let allusers = {
          'ravinder':{
            todos:{
              '1':{
                title:"uniq",
                description:"for testing",
                items:{
                  "1": {
                    description:"demo todo item",
                  }
                }
              }
            }
          }
        }
        th.status_is_ok(res);
        th.body_contains(res,"todo for uniq");
        th.body_contains(res,"basic functionalities");
        done();
      })
    })
  })
})
