process.env.testMode = true;
const chai = require('chai');
const assert = chai.assert;
const request = require('supertest');
const app = require('../app.js').app;

describe('app', () => {
  describe('GET /bad', () => {
    it('responds with 404', done => {
      request(app)
       .get('/bad')
       .expect(404)
       .end(done);
    })
  })
  describe('GET /', () => {
    it('redirects to login for loggedout user', done => {
      request(app)
      .get('/')
      .expect(302)
      .expect('Location','/login.html')
      .end(done);
    })
  })
  describe.skip('POST /login', () => {
    it('redirects to home for valid user', done => {
      request(app)
      .post('/login.html')
      // .set('Cookie',['sessionid=1234','userName=ravinder'])
      .send("userName=ravinder")
      .expect(302)
      .expect('Location','/home')
      .end(done);
    })
    it('redirects to login for invalid user', done => {
      request(app)
      .post('/login.html')
      .expect(302)
      .expect('Location','/login.html')
      .end(done);
    })
    ////////////
    it('res body should contain login failed message for invalid login', done => {
      request(app)
      .post('/login.html')
      // .set('Cookie',['sessionid=1234','userName=omkar'])
      .expect(200)
      .end(done);
      // request(app, { method: 'GET', url: '/login', headers:{cookie:"message=logInFailed"} }, res => {
      //   th.status_is_ok(res);
      //   th.body_contains(res,"Invalid user or password!")
      //   done();
      // })
    })
  })
  describe.skip('GET /logout', () => {
    it('redirects to login after logout', done => {
      request(app, { method: 'GET', url: '/logout' }, res => {
        th.should_be_redirected_to(res, '/login');
        th.should_not_have_cookie(res, 'logInFailed');
        done();
      })
    })
  })
  describe.skip('GET /login', () => {
    it('serves login for loggedout user', done => {
      request(app, { method: 'GET', url: '/login' }, res => {
        th.status_is_ok(res);
        th.body_contains(res, 'login to create to-do');
        th.body_does_not_contain(res, 'login failed');
        th.should_not_have_cookie(res, 'login failed');
        done();
      })
    })
    it('serves home for loggedin user', done => {
      request(app,{method: "GET", url: "/login", headers:{cookie:"userName=ravinder"}},res=>{
        th.should_be_redirected_to(res, '/home');
        done();
      })
    })
  })
  describe.skip('GET /home', () => {
    it('serves login if no user', done => {
      request(app, { method: 'GET', url: '/home'}, res => {
        th.should_be_redirected_to(res,"/login");
        done();
      })
    })
    it.skip('serves home if logged in', done => {
      request(app, { method: 'GET', url: '/home', headers:{cookie:"userName=ravinder"}}, res => {
        th.status_is_ok(res);
        done();
      })
    })
  })
  describe.skip('GET /create', () => {
    it('responds with 404', (done) => {
      request(app, { method: 'GET', url: '/create', body: '{title: "todoTitle", description: "something"}' }, res => {
        th.status_not_found(res);
        th.body_does_not_contain(res, 'todoTitle');
        done();
      })
    })
    it('responds with 404 when title and description are not given', (done) => {
      request(app, { method: 'GET', url: '/create', body: '{title: "", description: ""}' }, res => {
        th.status_not_found(res);
        th.body_does_not_contain(res, 'todoTitle')
        done();
      })
    })
  });
  describe.skip('POST /create', () => {
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
  describe.skip("POST /viewTodo",()=>{
    it('shows a todo once user has clicked on view button',done=>{
      request(app,{method:'POST',url:'/viewTodo',body:'todoId=123456',headers:{cookie:"userName=ravinder"}},res=>{
        th.status_is_ok(res);
        th.body_contains(res,"todo for uniq");
        th.body_contains(res,"basic functionalities");
        done();
      })
    })
  })
})