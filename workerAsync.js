const creatHeader = require("./requestHeader");
const request = require("request");
const parse = require('./parse');
const config = require("./config")
var rp = function(hearder){
    return new Promise(function(resolve,reject){
        request(hearder,function(err,respose){
            if(err){
               reject(err);
            }
            resolve(respose);
        });
    });
}

async function requestId(id){
    var url = `http://example.com/id=${id}`;
    console.log(`request: ${url}, child_process id: ${process.pid}`);
    var header = creatHeader(url);
    let response = await rp(header).catch(err=>{
        console.log(err);
    });
   // console.log("--------------status code  " +response.statusCode + "--------------------------");
    //console.log(response.body);
    if (response && response.statusCode == config.validResponseStatus){
        var msg = parse.processPage(response.body);
        return msg;
    }else {
        return undefined;
    }
}

module.exports = requestId;
