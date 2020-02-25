  var process = require("process");
  var cp = require("child_process");
  var fs = require("fs");
  var cpgenerator = require("./childprocess-generator").cp;


  const serverfile = "./././././server.js"
  var server = cpgenerator.generateHttpProcess(serverfile);

  fs.watchFile('server.js',function(event,filename){
     
       // server.kill("SIGHUP");
        console.log('server stopped');
        //server.stdin.pause();
        server.kill();//kill have problem when using child_process.execFile
        server = cpgenerator.generateHttpProcess(serverfile);
        console.log('server restarted');
  }); 

  process.on('SIGINT',function(){
        server.kill();
        fs.unwatchFile(serverfile);
        process.exit();
  }); 
