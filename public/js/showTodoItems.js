const createPara = function(todoItem){
  let para = document.createElement("p");
  para.innerText = todoItem.text;
  para.id = todoItem.id;
  return para;
}

const createDelButton = function(id){
  let delButton = document.createElement("button");
  delButton.innerText = "delete";
  delButton.id = id;
  // delButton.onclick = deleteItem;
  return delButton;
}

const showItemsList = function(){
  let todoItems = JSON.parse(this.responseText);
  console.log(todoItems);
  let itemsDiv = document.getElementsByClassName("items")[0];
  todoItems.forEach(item=>{
    let todoItem = createPara(item);
    let delbutton = createDelButton(item.id);
    // let editButton = createEditButton();
    let lineBreak = document.createElement("br");
    itemsDiv.appendChild(todoItem);
    itemsDiv.appendChild(delbutton);
    // itemsDiv.appendChild(editButton);
    itemsDiv.appendChild(lineBreak);
  })
}

let showTodoItems = function(){
  let todoId = document.querySelector("h1").id;
  let req = new XMLHttpRequest();
  req.addEventListener("load",showItemsList);
  req.open("POST","/todoItems");
  req.send(`todoId=${todoId}`);
}

window.onload = showTodoItems;
