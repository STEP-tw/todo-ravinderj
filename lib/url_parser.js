class UrlParser {
  constructor(url){
    this.url = url;
  }
  isValidUrl(){
    let regex = new RegExp(/\/\w+\/[0-9]+/);
    return regex.test(this.url);
  }
  getUserName(){
    let regex = new RegExp(/\/\w+\//);
    let title = this.url.match(regex).join("");
    return title.slice(1,-1);
  }
  getId(){
    let title = this.getUserName();
    return this.url.slice(title.length+2);
  }
  parse(){
    let userName = this.getUserName();
    let todoId = this.getId();
    return {userName:userName,todoId:todoId};
  }
}

module.exports = UrlParser;