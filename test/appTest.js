process.env.testMode = true;
const chai = require('chai');
const assert = chai.assert;
const request = require('supertest');
const app = require('../app.js').app;

let doesNotContain = (pattern)=>{
  return (res)=>{
    let match = res.text.match(pattern);
    if(match) throw new Error(`'${res.text}' contains '${pattern}'`);
  }
};

app.sessionidGenerator = function(){
  return '1234';
}

let doesNotHaveCookies = (res)=>{
  const keys = Object.keys(res.headers);
  let key = keys.find(k=>k.match(/set-cookie/i));
  if(key) throw new Error(`Didnot expect Set-Cookie in header of ${keys}`);
}

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
  describe('POST /login', () => {
    it('redirects to home for valid user', done => {
      request(app)
      .post('/login.html')
      .send("name=ravinder")
      .expect(302)
      .expect('set-cookie','sessionid=1234; Path=/,userName=ravinder; Path=/')
      .expect('Location','/home')
      .end(done);
    })
    it('serves login page for invalid user with login failed message', done => {
      request(app)
      .post('/login.html')
      .send("name=bad")      
      .expect(200)
      .expect(/Wrong username/)
      .expect(/login/)
      .end(done);
    })
  })
  describe('GET /logout', () => {
    it('redirects to login after logout', done => {
      request(app)
      .get('/logout')
      .expect(302)
      .expect('Location','/login.html')
      .end(done);
    })
  })
  describe('GET /login', () => {
    it('serves login for loggedout user', done => {
      request(app)
      .get('/login.html')
      .expect(200)
      .expect('Content-Type',/html/)
      .end(done);
    })
    it.skip('serves home for loggedin user', done => {
      request(app,{method: "GET", url: "/login", headers:{cookie:"userName=ravinder"}},res=>{
        th.should_be_redirected_to(res, '/home');
        done();
      })
    })
  })
  describe.skip('GET /home', () => {
    it.skip('serves login if no user', done => {
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
    it.skip('responds with 404', (done) => {
      request(app, { method: 'GET', url: '/create', body: '{title: "todoTitle", description: "something"}' }, res => {
        th.status_not_found(res);
        th.body_does_not_contain(res, 'todoTitle');
        done();
      })
    })
    it.skip('responds with 404 when title and description are not given', (done) => {
      request(app, { method: 'GET', url: '/create', body: '{title: "", description: ""}' }, res => {
        th.status_not_found(res);
        th.body_does_not_contain(res, 'todoTitle')
        done();
      })
    })
  });
  describe.skip('POST /create', () => {
    it.skip('creates a todo when title and description are given', (done) => {
      request(app, { method: 'POST', url: '/create', body: '{title: "todoTitle", description: "something"}' }, res => {
        th.status_is_ok(res);
        th.body_contains(res, 'todoTitle')
        done();
      })
    })
    it.skip('redirects to home when title and description are not given', (done) => {
      request(app, { method: 'POST', url: '/create', body: '{title: "", description: ""}' }, res => {
        th.body_does_not_contain(res, 'todoTitle')
        done();
      })
    })
  })
  describe.skip("POST /viewTodo",()=>{
    it.skip('shows a todo once user has clicked on view button',done=>{
      request(app,{method:'POST',url:'/viewTodo',body:'todoId=123456',headers:{cookie:"userName=ravinder"}},res=>{
        th.status_is_ok(res);
        th.body_contains(res,"todo for uniq");
        th.body_contains(res,"basic functionalities");
        done();
      })
    })
  })
})