var cp = require("child_process");
const config = require("./config");
var startType = config.startServerType;
const serverfile = __dirname + "/server.js";

function startServerBySpawn(serverfile){
    console.log("start server by spawn.");
    var server = cp.spawn("node",[serverfile], {
        silent: false,
        shell:false,
        //detached :true
        },{ stdio: ['pipe', 'pipe', "pipe","ipc"] }
    );    

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
    
    return server;
}

function startServerByFork(serverpath){
    console.log("start server by fork.");
    var path =  serverpath;
    console.log("server file: ",path);
    var server = cp.fork(path, {
        silent: false,
        //detached :true
        },{ stdio: ['ipc', 'ipc', "ipc"] }
    );    

    server.on("message",function(e){
        console.log(`message from child: ${JSON.stringify(e)}`);
    });

    server.send && server.send({hello:" i am parent process."});
    return server;
}

function startServerByExecFile(serverfile){
    console.log("start server by execFile.");
    var server = cp.execFile("node", [serverfile],(error,stdout,stderr)=>{
        if(error){
            console.log(` server failed:`,error);
            process.exit();
        }
            
        if(stdout){
            console.log("stdout:", stdout);
        }
        if(stderr){
            console.log("stderror:",stderr);
        }
    }
    );    
    return server;
}

function startServerByExec(serverfile){
    console.log("start server by exec.");
    var server = cp.spawn("node",[serverfile], {
        silent: false,
        //detached :true
        },(error,stdout,stderr)=>{
            if(error){
                console.log("error: ",error);
            }

            if(stdout){
                console.log("stdout:", stdout);
            }
            if(stderr){
                console.log("stderror:",stderr);
            }
        }
    );    

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
    
    return server;
}
module.exports.cp = {

    generateHttpProcess:function(serverpath){
        switch(startType){
            case "spawn":
                return startServerBySpawn(serverfile);
            case "fork":
                return startServerByFork(serverpath);
            case "execFile":
             return startServerByExecFile(serverfile);
            case "exec":
                return startServerByExec(serverfile);
            default:
                return null;
        }
    }

};