const cheerio = require("cheerio");

function parseBody(body){
    var $ = cheerio.load(body);
    var h1 = $("h1").html();
    var href = $("p a").attr("href");
    if(!href)
      return undefined;
    return {href:href,h1:h1};
}

module.exports.processPage = parseBody;