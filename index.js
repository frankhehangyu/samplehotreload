  var process = require("process");
  var cp = require("child_process");
  var fs = require("fs");
  var cpgenerator = require("./childprocess-generator").cp;

  const serverfile = "./server.js"
  var server = cpgenerator.generateHttpProcess(serverfile);
  console.log('Server started');
  
  fs.watchFile('server.js',function(event,filename){
     
       // server.kill("SIGHUP");
        console.log('server stopped');
        server.kill();
        server = cpgenerator.generateHttpProcess(serverfile);
        console.log('server restarted');
  }); 

  process.on('SIGINT',function(){
        server.kill();
        fs.unwatchFile(serverfile);
        process.exit();
  }); 
