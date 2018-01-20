const createTodoItem = function(todoItem){
  let para = document.createElement("p");
  para.innerText = todoItem.text;
  para.id = todoItem.id;
  return para;
}

const createDelButton = function(id){
  let delButton = document.createElement("button");
  delButton.innerText = "delete";
  delButton.id = id;
  // delButton.onclick = deleteTodo;
  return delButton;
}

const showItemsList = function(){
  let todoItems = JSON.parse(this.responseText);
  console.log(todoItems);
  let itemsDiv = document.getElementsByClassName("items")[0];
  todoItems.forEach(item=>{
    let todoItem = createTodoItem(item);
    let delbutton = createDelButton(item.id);
    let lineBreak = document.createElement("br");
    itemsDiv.appendChild(todoItem);
    itemsDiv.appendChild(delbutton);
    itemsDiv.appendChild(lineBreak);
  })
}
// let editButton = createEditButton();
// itemsDiv.appendChild(editButton);

let showTodoItems = function(){
  let todoId = document.querySelector("h1").id;
  let req = new XMLHttpRequest();
  req.addEventListener("load",showItemsList);
  req.open("POST","/todoItems");
  req.send(`todoId=${todoId}`);
}

window.onload = showTodoItems;
