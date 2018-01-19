let showTodoList = function(){
  let titlesInfo = JSON.parse(this.responseText);
  let todoList = document.getElementById("todoList");
  console.log(titlesInfo);
  titlesInfo.forEach((titleInfo)=>{
    let todoLink = createLink(titleInfo);
    let delbutton = createDelButton(titleInfo.todoId);
    let viewButton = createViewButton(titleInfo.todoId);
    let lineBreak = document.createElement("br");
    todoList.appendChild(todoLink);
    todoList.appendChild(delbutton);
    todoList.appendChild(viewButton);
    todoList.appendChild(lineBreak);
  })
  console.log(todoList);
}

let showTitles = function(){
  let req = new XMLHttpRequest();
  req.addEventListener("load",showTodoList);
  req.open("GET","/titles");
  req.send();
}

window.onload = showTitles;
