const WebApp = require('./webapp');
const lib = require("./lib/serverLIb.js");

let app = WebApp.create();
app.use(lib.logRequest);
app.use(lib.loadUser);
app.use(lib.servePage);
app.use(lib.todoHandler);
app.get("/home.html", lib.serveHomePage);
app.post("/create", lib.createTodo);
app.get("/titles",lib.sendTitleInfo);
app.remove("/deleteTodo",lib.deleteTodo);
app.post("/addItem", lib.sendTodoItem);
app.post("/login", lib.loginUser);
app.post("/logout", lib.logoutUser)

exports.app = app;