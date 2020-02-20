const http = require("http");
const process = require("process");
var stringutility = require("./encode");

process.on('message', (msg) => {
    console.log('Message from parent:', msg);
  });
  console.log('Message from child:');

const hostname = "127.0.0.1";
const port  = 3002;
var i = 0;
var encrypt = '';
var original = 'admin';
const server = http.createServer(function(req,res){
    console.log("accept request");
    res.statusCode = 200;
    res.setHeader('Content-Type','text/plain');
    var msg = stringutility.encode("frank","base64");
    if(i %2 == 0){
        encrypt =  msg = stringutility.encode(original,"base64");
    }else{
        msg = stringutility.decode(encrypt);
    }
    i++;
    const buf = Buffer.alloc(11,'aGVsbG8gd29ybGQ=','base64');
    res.end(msg);
});     

server.listen(port,hostname,()=>{
   console.log(`server running at http://${hostname}:${port}`);
});
