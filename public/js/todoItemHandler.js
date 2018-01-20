const showItem = function(){
  let todoItem = JSON.parse(this.responseText);
  let itemText = todoItem.text;
  let todoId = todoItem.todoId;
  let itemId = todoItem.itemId;
  let para = document.createElement("p");
  para.innerHTML = itemText;
  para.id = itemId;
  let itemsDiv = document.getElementsByClassName("items")[0];
  itemsDiv.appendChild(para);
}

const createItem = function(){
  let text = document.querySelector("#itemText").value;
  let req = new XMLHttpRequest();
  req.addEventListener("load",showItem);
  req.open("POST","/addItem");
  req.send(`text=${text}`);
};
