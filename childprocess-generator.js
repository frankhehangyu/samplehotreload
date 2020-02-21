var cp = require("child_process");
module.exports.cp = {

    generateHttpProcess:function(serverfile){
        var server = cp.spawn("node",[serverfile], {
            silent: false,
            //detached :true
            },{ stdio: ['ipc', 'ipc', "ipc"] }
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

};