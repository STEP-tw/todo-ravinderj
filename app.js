const WebApp = require('./webapp');
const lib = require("./lib/serverLIb.js");

let app = WebApp.create();

app.remove("/deleteTodo",lib.deleteTodo);
app.get("/home.html", lib.serveHomePage);
app.get("/titles",lib.sendTitleInfo);
app.get("/logout", lib.logoutUser);
app.use(lib.logRequest);
app.use(lib.loadUser);
app.use(lib.servePage);
app.use(lib.todoHandler);
app.post("/create", lib.createTodo);
app.post("/addItem", lib.sendTodoItem);
app.post("/login", lib.loginUser);
app.post("/viewTodo", lib.sendTodoView);

exports.app = app;
