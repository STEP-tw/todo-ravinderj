let createLink = (todo)=>{
  let link = document.createElement("a");
  let url = `${todo.userName}/${todo.todoId}`;
  link.href = encodeURI(url);
  link.innerText = todo.title;
  return link;
}

let showTodo = function(){
  let data = JSON.parse(this.responseText);
  let todoList = document.getElementById("todoList");
  let todoLink = createLink(data);
  todoList.appendChild(todoLink);
  let lineBreak = document.createElement('br');
  todoList.appendChild(lineBreak);
  console.log(todoLink);
}

let createTodo = function(){
  let title = document.getElementById('title').value;
  let description = document.getElementById('description').value;
  let req = new XMLHttpRequest();
  req.addEventListener("load",showTodo);
  req.open("POST","/create");
  req.send(`title=${title}&description=${description}`);
}