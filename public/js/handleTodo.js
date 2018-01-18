const createLink = (todo)=>{
  let link = document.createElement("a");
  let url = `${todo.userName}/${todo.todoId}`;
  link.href = encodeURI(url);
  link.innerText = todo.title;
  return link;
}

const createDelButton = function(todoId){
  let delButton = document.createElement("button");
  delButton.innerText = "delete";
  delButton.id = todoId;
  delButton.onclick = deleteTodo;
  return delButton;
}

const showTodo = function(){
  let todoDetails = JSON.parse(this.responseText);
  let todoList = document.getElementById("todoList");
  let todoLink = createLink(todoDetails);
  let delButton = createDelButton(todoDetails.todoId);
  let lineBreak = document.createElement('br');
  todoList.appendChild(todoLink);
  todoList.appendChild(delButton);
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