let getAllTodos = function(data,user){
  let allTodos = Object.keys(data[user].todos);
  return allTodos.map((todo)=>{
    return data[user].todos[todo].title;
  });
}

let showTodoItem = function(){
  let data = JSON.parse(this.responseText);
  let todoList = document.getElementById("todoList");
  let allTodos = getAllTodos(data,"ravinder");
  let todoLinks = createTodoLinks(allTodos);
  todoList.innerHTML = todoLinks;
  console.log(todoLinks);
}

let showTodoDataForm = function(){
  // let req = new XMLHttpRequest();
  // req.addEventListener("load",showTodoItem);
  // req.open("POST","/todoData");
  // req.send();
  alert("hello")
}