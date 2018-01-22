const createPara = function(todoItem){
  let para = document.createElement("p");
  para.innerText = todoItem.text;
  para.className = todoItem.id;
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

const createSubmitButton = function(id){
  let submitButton = document.createElement("button");
  submitButton.innerText = "Submit";
  submitButton.id = id;
  submitButton.onclick = sendEditItemRequest;
  return submitButton;
}

const appendTodoItem = function(item,itemsDiv){
  let todoItem = createPara(item);
  let delbutton = createDelButton(item.id);
  let editButton = createEditButton(item.id);
  let lineBreak = document.createElement("br");
  itemsDiv.appendChild(todoItem);
  itemsDiv.appendChild(delbutton);
  itemsDiv.appendChild(editButton);
  itemsDiv.appendChild(lineBreak);
  return itemsDiv;
}

const showItemsList = function(){
  let todoItems = JSON.parse(this.responseText);
  let itemsDiv = document.getElementsByClassName("items")[0];
  todoItems.forEach((item)=>appendTodoItem(item,itemsDiv));
}

let showTodoItems = function(){
  let todoId = document.querySelector("h1").id;
  let req = new XMLHttpRequest();
  req.addEventListener("load",showItemsList);
  req.open("POST","/todoItems");
  req.send(`todoId=${todoId}`);
}

const editItem = function(){
  refreshPage();
}

const sendEditItemRequest = function(){
  let todoId = document.querySelector('h1').id;
  let itemId = event.target.id;
  let req = new XMLHttpRequest();
  req.addEventListener('load',editItem);
  req.open('PUT','/editItem');
  req.send(`itemId=${itemId}&todoId=${todoId}`);
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
  let itemsDiv = document.getElementsByClassName("items")[0];
  let itemId = event.target.id;
  let textElement = document.getElementsByClassName(itemId)[0];
  let inputElement = document.createElement("input");
  inputElement.value = textElement.innerText;
  textElement.replaceWith(inputElement);
  itemsDiv.removeChild(document.getElementById(itemId));
  let submitButton = createSubmitButton(itemId);
  document.getElementById(itemId).replaceWith(submitButton);
}

window.onload = showTodoItems;
