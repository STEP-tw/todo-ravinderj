class Fs{
    constructor(){
        this.files={}
    }
    addFile(name,content=''){
        this.files[name]=content;
    }
    existsSync(fileName){
        return Object.keys(this.files).includes(fileName);
    }
    readFileSync(fileName){
        if(!this.existsSync(fileName)){
            throw new Error('File not found');
        }
        return this.files[fileName];
    }
}

module.exports = Fs;