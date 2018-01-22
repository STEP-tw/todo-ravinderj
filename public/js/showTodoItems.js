const createPara = function(todoItem){
  let para = document.createElement("p");
  para.innerText = todoItem.text;
  para.id = todoItem.id;
  return para;
}

const createDelButton = function(id){
  let delButton = document.createElement("button");
  delButton.innerText = "Delete";
  delButton.id = id;
  delButton.onclick = deleteItem;
  return delButton;
}

const createEditButton  = function(id){
  let editButton = document.createElement("button");
  editButton.innerText = "Edit";
  editButton.id = id;
  editButton.onclick = createInputToEdit;
  return editButton;
}

const showItemsList = function(){
  let todoItems = JSON.parse(this.responseText);
  console.log(todoItems);
  let itemsDiv = document.getElementsByClassName("items")[0];
  todoItems.forEach(item=>{
    let todoItem = createPara(item);
    let delbutton = createDelButton(item.id);
    let editButton = createEditButton(item.id);
    let lineBreak = document.createElement("br");
    itemsDiv.appendChild(todoItem);
    itemsDiv.appendChild(delbutton);
    itemsDiv.appendChild(editButton);
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

const refreshPage = function(){
  window.location.reload();
}
const removeItem = function(){
  refreshPage();
}

const deleteItem = function(){
  let itemId = event.target.id;
  let todoId = document.querySelector('h1').id;
  let req = new XMLHttpRequest();
  req.addEventListener("load",removeItem);
  req.open("POST","/deleteItem");
  req.send(`itemId=${itemId}&todoId=${todoId}`);
}

const createInputToEdit = function(){
  let itemId = event.target.id;
  let textElement = document.getElementById(itemId);
  let inputElement = document.createElement("input");
  inputElement.value = textElement.innerText;
  textElement.replaceWith(inputElement);
}

window.onload = showTodoItems;
