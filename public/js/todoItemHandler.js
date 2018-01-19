const showItem = function(){
  let itemText = this.responseText.text;
  let todoId = this.responseText.todoId;
  let itemId = this.responseText.itemId;
}

const createItem = function(){
  let para = document.createElement("p");
  let text = document.querySelector("#itemText").value;
  para.innerHTML = text;
  let itemsDiv = document.getElementsByClassName("items")[0];
  itemsDiv.appendChild(para);
  let req = XMLHttpRequest();
  req.addEventListener("load",showItem);
  req.open("POST","/addItem");
  req.send(`todoItem=${text}`);
};