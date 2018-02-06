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

let doesContain = (pattern)=>{
  return (res)=>{
    let match = res.text.match(pattern);
    return match;
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
      .expect(/login/)
      .end(done);
    })
    it('serves home for loggedin user', done => {
      request(app)
      .get('/login.html')
      .send("name=ravinder")
      .set('cookie','sessionid=1234;userName=ravinder')
      .expect(302)
      .expect('Location','/home')
      .end(done);
    })
  })
  describe('GET /home', () => {
    it('serves login if no user', done => {
      request(app)
      .get('/home')
      .expect(302)
      .expect('Location','/login.html')
      .end(done);
    })
    it('serves home if logged in', done => {
      request(app)
      .get('/home')
      .send("name=ravinder")
      .set('cookie','sessionid=1234;userName=ravinder')
      .expect(200)
      .expect('Content-Type',/html/)
      .expect(/TO-DO/)
      .end(done);
    })
  })
  describe('GET /create', () => {
    it('responds with 404', (done) => {
      request(app)
      .get('/create')
      .expect(404)
      .expect(doesNotContain(/todoTitle/))
      .end(done);
    })
    it('responds with 404 when title and description are not given', (done) => {
      request(app)
      .get('/create')
      .send('title=""&description=""')
      .expect(404)
      .expect(doesNotContain(/todoTitle/))
      .end(done);
    })
  });
  describe('POST /create', () => {
    it('creates a todo when title and description are given', (done) => {
      request(app)
      .post('/create')
      .send('title="todoTitle"&description="something"')
      .expect(200)
      .expect(/todoTitle/)
      .end(done);
    })
    it('redirects to home when title and description are not given', (done) => {
      request(app)
      .post('/create')
      .send('title=""&description=""')
      .expect(doesNotContain(/todoTitle/))
      .end(done);
    })
  })
  describe("POST /viewTodo",()=>{
    it('shows a todo once user has clicked on view button',done=>{
      request(app)
      .post('/viewTodo')
      .send('todoId=123456')
      .set('cookie','sessionid=1234;userName=ravinder')
      .expect(/todo for uniq/)
      .expect(/basic functionalities/)
      .expect(200)
      .end(done);
    })
  })
  describe('POST /addItem',()=>{
    it('creates an item once the user clicks on add item button',done=>{
      request(app)
      .post('/addItem')
      .send('todoId=123456&text="hello"')
      .set('cookie','sessionid=1234;userName=ravinder')
      .expect(/hello/)
      .expect(200)
      .end(done);
    })
  })
  describe('PUT /editItem',()=>{
    it('edits an item once the user clicks on edit button',done=>{
      request(app)
      .put('/editItem')
      .send('todoId=123457&itemId=1&newText="hello"')
      .set('cookie','sessionid=1234;userName=ravinder')
      .expect(doesNotContain(/adding basic functionalities/))
      .expect(/editing an item/)
      .expect(200)
      .end(done);
    })
  })
  describe('DELETE /deleteItem',()=>{
    it('deletes an item once the user clicks on delete button',done=>{
      request(app)
      .delete('/deleteItem')
      .send('todoId=123456&itemId=1')
      .set('cookie','sessionid=1234;userName=ravinder')
      .expect(doesNotContain(/adding basic functionalities/))
      .expect(/deleting an item/)
      .expect(200)
      .end(done);
    })
  })
  describe('DELETE /deleteTodo',()=>{
    it('deletes a todo once the user clicks on delete button',done=>{
      request(app)
      .delete('/deleteTodo')
      .send('todoId=123456')
      .set('cookie','sessionid=1234;userName=ravinder')
      .expect(doesNotContain(/uniq/))
      .expect(/deleting todo/)
      .expect(200)
      .end(done);
    })
  })
  describe('POST /todoItems',()=>{
    it('sends todo info once the user clicks on todo title link',done=>{
      request(app)
      .post('/todoItems')
      .send('todoId=123457')
      .set('cookie','sessionid=1234;userName=ravinder')
      .expect(doesContain(/{"id":1,"text":"adding basic functionalities","isDone":true}/))
      .expect(200)
      .end(done);
    })
  })
  describe('GET /titles',()=>{
    it.skip('sends todo titles once the user enters home page',done=>{
      request(app)
      .get('/titles')
      .set('cookie','sessionid=1234;userName=ravinder')
      .expect(/hello/)
      .expect(200)
      .end(done);
    })
  })
})
