const parse = require('./parse');
const creatHeader = require("./requestHeader");
const request = require("request");
var begin =  Number(process.argv[2]);
var end = Number(process.argv[3]);
console.log(`begin: ${begin}`);
console.log(`end: ${end}`);
var tmp = begin;
function requestId(){
    var url = `http://example.com/id=${begin}`;
    var header = creatHeader(url);
    console.log(`request: ${url}`);
    request(header,function(err,respose){
        if(err){
            console.log(err);
            return;
        }
        parse.processPage(respose.body);
    });
    
    begin++;
   
}

while(begin < end){
    if(begin - tmp == 5){
        console.log("----------------------------------------------------------------------------------------------------");
        setTimeout( requestId, 10000);
        tmp = begin;
    }else{
        requestId();
    }
}