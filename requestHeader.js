function creatHeader(url){
    var option = {
        url:url,
        headers:{
            'Accept':'text/html',
            'Accept-charset':'utf8',
            'Cache-Control':'max-age=0',
            'Connection':'keep-alive',
            'Accept-Language':'zh-CN,zh,q=0.8,en',
        }
    };
    return option;
}

module.exports = creatHeader;