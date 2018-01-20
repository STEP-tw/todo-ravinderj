const createLink = (todo)=>{
  let link = document.createElement("a");
  let url = `${todo.userName}/${todo.todoId}`;
  link.href = encodeURI(url);
  link.innerText = todo.title;
  return link;
}

const createDelButton = function(id){
  let delButton = document.createElement("button");
  delButton.innerText = "delete";
  delButton.id = id;
  delButton.onclick = deleteTodo;
  return delButton;
}

const createViewButton = (todoId)=>{
  let viewButton = document.createElement("button");
  viewButton.innerText = "view";
  viewButton.id = todoId;
  viewButton.onclick = viewTodo;
  return viewButton;
}

const showTodo = function(){
  let todoDetails = JSON.parse(this.responseText);
  let todoList = document.getElementById("todoList");
  let todoLink = createLink(todoDetails);
  let delButton = createDelButton(todoDetails.todoId);
  let viewButton = createViewButton(todoDetails.todoId);
  let lineBreak = document.createElement('br');
  todoList.appendChild(todoLink);
  todoList.appendChild(delButton);
  todoList.appendChild(viewButton);
  todoList.appendChild(lineBreak);
  console.log(todoLink);
}

const createTodo = function(){
  let title = document.getElementById('title').value;
  let description = document.getElementById('description').value;
  let req = new XMLHttpRequest();
  req.addEventListener("load",showTodo);
  req.open("POST","/create");
  req.send(`title=${title}&description=${description}`);
}

const refreshPage = ()=>window.location.reload();
const removeTodo = function(){
  let response = this.responseText;
  console.log(response);
  refreshPage();
}

const deleteTodo = function(event){
  let todoId = event.target.id;
  let req = new XMLHttpRequest();
  req.addEventListener("load",removeTodo);
  req.open("delete","/deleteTodo");
  req.send(`todoId=${todoId}`);
};

const displayTodo = function(){
  let viewContent = this.responseText;
  let todoViewDiv = document.getElementsByClassName("todo-view")[0];
  todoViewDiv.innerHTML = viewContent;
}

const viewTodo = function(event){
  let todoId = event.target.id;
  let req = new XMLHttpRequest();
  req.addEventListener("load",displayTodo);
  req.open("POST","/viewTodo");
  req.send(`todoId=${todoId}`);
};
