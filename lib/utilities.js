class UrlParser {
  constructor(url){
    this.url = url;
  }
  isValid(){
    let regex = new RegExp(/\/\w+\/[1-9]+/);
    return regex.test(this.url);
  }
  getUserName(){
    let regex = new RegExp(/\/\w+\//);
    let title = this.url.match(regex);
    return title.slice(1,-1);
  }
  getId(){
    let title = this.getUserName();
    return this.url.slice(title.length+2);
  }
  parse(){
    let userName = this.getUserName();
    let id = this.getId();
    return {userName:userName,id:id};
  }
}

