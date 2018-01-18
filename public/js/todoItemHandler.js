const createItem = function(){
  let para = document.createElement("p");
  let text = document.querySelector("#itemText").value;
  para.innerHTML = text;
  let itemsDiv = document.getElementsByClassName("items")[0];
  itemsDiv.appendChild(para);
};