const WebApp = require('./webapp');
const lib = require("./lib/serverLIb.js");

let app = WebApp.create();

app.remove("/deleteTodo",lib.deleteTodo);
app.get("/home", lib.serveHome);
app.get("/login",lib.serveLogin);
app.get("/titles",lib.sendTitleInfo);
app.get("/logout", lib.logoutUser);
app.use(lib.logRequest);
app.use(lib.loadUser);
app.use(lib.servePage);
app.use(lib.todoHandler);
app.use(lib.redirectToHomeIfLoggedin);
app.use(lib.redirectToLoginIfLoggedOut);
app.post("/create", lib.createTodo);
app.post("/todoItems",lib.sendItemsInfo);
app.post("/addItem", lib.createItem);
app.post("/deleteItem", lib.deleteItem);
app.post("/login", lib.loginUser);
app.post("/viewTodo", lib.sendTodoView);

exports.app = app;
