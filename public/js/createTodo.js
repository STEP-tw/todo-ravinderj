let createLink = (todoTitle,todoId,userName)=>{
  let link = document.createElement("a");
  let url = `${userName}/${todoId}`;
  link.href = encodeURI(url);
  link.innerText = todoTitle;
  return link;
}

let showTodoList = function(){
  let data = JSON.parse(this.responseText);
  let todoList = document.getElementById("todoList");
  let todoLink = createLink(data.title,data.todoId,data.userName);  
  todoList.appendChild(todoLink);
  let lineBreak = document.createElement('br');
  todoList.appendChild(lineBreak);
  console.log(todoLink);
}

let createTodo = function(){
  let title = document.getElementById('title').value;
  let description = document.getElementById('description').value;
  let req = new XMLHttpRequest();
  req.addEventListener("load",showTodoList);
  req.open("POST","/create");
  req.send(`title=${title}&description=${description}`);
}