var redis = require("redis");
var EventEmitter = require("events");
const bluebird = require("bluebird");
var config = require("./config");

var client = redis.createClient(config.redisPort,config.redisHost);
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

var startId = config.startID;
console.log("startId in config is: ",startId)

client.on("error",function(err){
    console.log(err);
    process.exit();
});

client.on("ready",async ()=>{
    var currentId = await client.lpopAsync("scrapy");
    if(currentId)
        startId = currentId;
    console.log("startId is ",startId);
    var length = await getListLength();
    if(length < config.threshold)
    producer.emit("begin");
});

class Producer extends EventEmitter{
    constructor(){
        super();
        this.status = "ready";
        this.id = startId;
    }

}

var producer = new Producer();

producer.on("pause",function(){
    if(this.status == "begin"){
        console.log("producer will pause,current id:",this.id);
        this.status = "pause";
    }
});

producer.on("resume",function(){
    if(this.status == "pause"){
        console.log("producer will begin,current id:",this.id);
        this.emit("begin");
    }
});

producer.on("begin",async function(){
    //console.log(`------------------------${JSON.stringify(this)}----------------------------------`);
    this.status = "begin";
    while(true){
        if(this.status == "pause"){
            break;
        }
        var msg = this.id;
        console.log(`------------------------push id: ${this.id}----------------------------------`);
        await client.lpushAsync("scrapy",msg);
        ++this.id;
    }
});


async function getListLength(){
    var length = await client.llenAsync("scrapy");
  
    return length; 
}

setInterval(async ()=>{
    var length = await getListLength();
    if(length > config.threshold  && producer.status == "begin"){
        console.log("producer will pause.");
        producer.emit("pause");
    }
    else if(length < config.threshold && producer.status == "pause"){
        console.log("producer will resume.");
        producer.emit("resume");
    }

}, config.producerTimeout);
console.log("producer timeout ",config.producerTimeout);
