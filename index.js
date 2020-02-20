  var process = require("process");
var cp = require("child_process");
var fs = require("fs");

const serverfile = "server.js"
var server = cp.spawn("node",['./server.js']
, {
    silent: false,
    //detached :true
},function(error, stdout, stderr) {
    console.log('stdout: ', stdout);
    console.log('stderr: ', stderr);
    if (error !== null) {
        console.log('exec error: ', error);
    }
}
);

 console.log('Server started');
server.on('message', (msg) => {
    console.log('Message from child', msg);
  });

server.on("exit",function(code){
      console.log("exit");
});

server.stdout.on('data', function(data) {
    console.log('stdout: ' + data);
});

server.on("error",function(err){
      console.log(err);
  });
   
fs.watchFile('server.js',function(event,filename){
    server.kill();
    console.log('server stopped');
    server = cp.spawn("node",['server.js'], {
        silent: false,
        //detached :true
    },function(error, stdout, stderr) {
        console.log('stdout: ', stdout);
        console.log('stderr: ', stderr);
        if (error !== null) {
            console.log('exec error: ', error);
        }
    });
    console.log('server started');
}); 

process.on('SIGINT',function(){
    server.kill();
    fs.unwatchFile(serverfile);
    process.exit();
}); 
