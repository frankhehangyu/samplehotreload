module.exports = {
    startID:0,
    redisHost:"127.0.0.1",
    redisPort:6379,
    threshold:100,
    producerTimeout:10000,
    consumerTimeout:30000,
    validResponseStatus:404,
    defaultPersistSolution:"file",
    saveFilePath: __dirname+"/url.dat",
}