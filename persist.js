var fs = require("fs");
var config = require("./config");
var util = require("util");
const writeFileAsync = util.promisify(fs.writeFileSync);

var msgcount = 0;
var tempmsg = '';

async function persist(msg,callback){
    tempmsg += (msg + '\n');
    msgcount++;
    let result;
    console.log(`msgcount: ${msgcount}, child_process id: ${process.pid}`);
    if(msgcount > 20){
        console.log(`up to max limit,now save data`);
        msgcount = 0;
        result =  await save(tempmsg,callback);
    }

    result = await new Promise(function(resolve,reject){
                    resolve("cumulative data.");
                });
    return result;
}

async function save(data){
    switch(config.defaultPersistSolution){
        case "file":
            console.log(`save file, path: ${config.saveFilePath}, data:${data}`);
            await writeFileAsync(config.saveFilePath,data,{flag:'a'})
           /*  .then(function(ar1,ar2){
                console.log(ar1);
                console.log(ar2);
            }) */
            .catch(err=>{
                console.log(err);
            });
            fs.writeFileSync(config.saveFilePath,data,{flag:'a'})
            callback(null,"save data done.");
            break;
            default:
                await new Promise(function(resolve,reject){
                    resolve("not provide valid patyh");
                }).catch(err=>console.log(err));
                break;
    }
}

module.exports = persist;