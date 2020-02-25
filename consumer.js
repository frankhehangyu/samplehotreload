var redis = require("redis");
var EventEmitter = require("events");
const bluebird = require("bluebird");
const request = require("./workerAsync");
var config = require("./config");
const persist = require("./persist");

var client = redis.createClient(config.redisPort,config.redisHost);
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

client.on("error",(error)=>{
    console.log("consumer redis error: ",error);
    process.exit();
});

client.on("ready",()=>{
    console.log("consumer redis ready.");
    consumer.emit("begin");
});

class Consumer extends EventEmitter{
    constructor(){
        super();
        this.status = "ready";
    }
}

var consumer = new Consumer();

consumer.on("pause",function(){
    this.status = "pause";
    console.log("Consumer will pause");
});

consumer.on("resume",function(){
    if(this.status == "pause"){
        this.emit("begin");
    }
});

consumer.on("begin",async ()=>{
    this.status = "begin";
    while(true){
        var value = await client.rpopAsync("scrapy");
        let result = await Promise.race([request(value),timeout(10000)]);
        if(result){
           let response = await persist(JSON.stringify(result));
           console.log(response);
           // console.log(result);
        }
        if(this.status == "pause"){
            break;
        }
    }
});

async function getListLength(){
    console.log("Cousumer status ",consumer.status);
    var length = await client.llenAsync("scrapy");

    if(length == 0 && consumer.status == "begin"){
        console.log("cache is empty.");
        consumer.emit("pause");
    }else if(this.status == "pause" && length > config.threshold){
        console.log("items length in cache is greater than ",config.threshold);
        consumer.emit("resume");
    }
    console.log(`current length: ${length}`);
}

function timeout(ms){
    return new Promise(function(resolve,reject){
        setTimeout(resolve,ms,'timeout');
    });
}

setInterval(getListLength, config.consumerTimeout);