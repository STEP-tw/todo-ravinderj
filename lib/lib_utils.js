const getContentType = function (file) {
  let extn = file.slice(file.lastIndexOf("."));
  let extenstions = {
    ".js": "text/javascript",
    ".json": "application/json",
    ".gif": "image/gif",
    ".jpg": "image/jpg",
    ".html": "text/html",
    ".css": "text/css",
    ".pdf": "application/pdf"
  }
  return extenstions[extn] || "text/plain";
};

const getItemsList = function(todoItems){
  let items = Object.values(todoItems);
  return items.map(item=>{
    return item.description;
  });
};

const getTodoView = (title,description,todoItems) =>{
  let viewContent='';
  viewContent+=`Title: ${title}<br>`;
  viewContent+=`Description: ${description}<br><br>`;
  viewContent+=`Items:<br>${todoItems.join('<br>')}`;
  return viewContent;
}

module.exports = {
  getContentType,
  getItemsList,
  getTodoView
}
