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
var encrypt = 'YWRtaW4=';
var original = 'admin';  
  
const server = http.createServer(function(req,res){
    console.log("accept request");
    res.statusCode = 200;
    res.setHeader('Content-Type','text/plain');
    if(req.url == "/favicon.ico"){   
        res.end("favico request");
    }else{
        var msg = stringutility.encode("frank","base64");
        if(i % 2 == 0){
            encrypt =  msg = stringutility.encode(original,"base64");
            res.end(`${i}:i % 2 = 0, ${msg}`);
        }else{ 
            console.log("encrypt: " + encrypt);
            msg = stringutility.decode(encrypt,"base64");
            res.end(`${i}: i % 2 = 1, ${msg}`);
         }
        console.log(i % 2);
        i++; 
        //const buf = Buffer.alloc(11,'aGVsbG8gd29ybGQ=','base64');
    }
   
   
});     

server.listen(port,hostname,()=>{
   console.log(`server running at http://${hostname}:${port}`);
});

server.on("request",function(req){
    console.log(`request info: ${req.url}`);
});

