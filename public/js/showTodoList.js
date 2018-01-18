let createLink = (titleInfo)=>{
  let link = `<a href=${titleInfo.userName}/${titleInfo.todoId}>${titleInfo.title}</a>`
  return link;
}

let createTodoLinks = function(titlesInfo){
  return titlesInfo.map(createLink).join("<br>");
}

let showTodoList = function(){
  let titlesInfo = JSON.parse(this.responseText);
  let todoList = document.getElementById("todoList");
  let todoLinks = createTodoLinks(titlesInfo);
  todoList.innerHTML = todoLinks;
  console.log(todoLinks);
}

let showTitles = function(){
  let req = new XMLHttpRequest();
  req.addEventListener("load",showTodoList);
  req.open("GET","/titles");
  req.send();
}

window.onload = showTitles;