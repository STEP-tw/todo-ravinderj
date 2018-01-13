let getAllTodos = function(data,user){
  let allTodos = Object.keys(data[user].todos);
  return allTodos.map((todo)=>{
    return data[user].todos[todo].title;
  });
}

let createLink = (todoName)=>{
  let link = `<a href=${todoName}>${todoName}</a>`
  return link;
}

let createTodoLinks = function(todos){
  return todos.map(createLink).join("<br>");
}

let showTodoList = function(){
  let data = JSON.parse(this.responseText);
  let todoList = document.getElementById("todoList");
  let allTodos = getAllTodos(data,"ravinder");
  let todoLinks = createTodoLinks(allTodos);
  todoList.innerHTML = todoLinks;
  console.log(todoLinks);
}

let sayHello = function(){
  let req = new XMLHttpRequest();
  req.addEventListener("load",showTodoList);
  req.open("POST","/data");
  req.send();
}

window.onload = sayHello;