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
    let userName = this.url.match(regex).join("");
    return userName.slice(1,-1);
  }
  getId(){
    let userName = this.getUserName();
    return this.url.slice(userName.length+2);
  }
  parse(){
    let userName = this.getUserName();
    let todoId = this.getId();
    return {userName:userName,todoId:todoId};
  }
}

module.exports = UrlParser;
