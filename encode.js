var input,encode,decode;
module.exports = {
   
    encode:function(string,type){
        input = new Buffer(string);
        encode = input.toString(type);
        return encode;
    },
    decode:function(string,type){
        input = new Buffer(string,type);
        decode = input.toString();
        return decode;
    }

};