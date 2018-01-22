const showItem = function(){
  let itemsDiv = document.getElementsByClassName("items")[0];
  let todoItem = JSON.parse(this.responseText);
  let itemText = todoItem.text;
  let itemId = todoItem.id;
  let para = createPara(todoItem);
  let delButton = createDelButton(itemId);
  let lineBreak = document.createElement("br");
  itemsDiv.appendChild(para);
  itemsDiv.appendChild(delButton);
  itemsDiv.appendChild(lineBreak);
}

const createItem = function(){
  let todoId = document.querySelector("h1").id;
  let text = document.querySelector("#itemText").value;
  let req = new XMLHttpRequest();
  req.addEventListener("load",showItem);
  req.open("POST","/addItem");
  req.send(`todoId=${todoId}&text=${text}`);
};
