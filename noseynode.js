require('date-utils');

function createRecord(addr, url){ 
  var record = {
    "remote_address": addr,
    "url": url
  }
  console.log(record);
  return record;
}

var PROXY_PORT  = 8888;
var MONGO_SERVER = "192.168.1.102";
var httpProxy; 
var server;

/* Setup MongoDB */
var databaseUrl = "mongodb://" + "192.168.1.102" + ":27017/noseynode";
var collections = ["nnc"];
var db = require("mongojs").connect(databaseUrl, collections, function(err,db){
  if (err) console.log("error");
});

/* Setup Proxy */
httpProxy = require('http-proxy');
server = httpProxy.createServer(function(req, res, proxy) {
  var query;

  if (req.headers['host'] != null) {
    db.nnc.save(createRecord(req.connection.remoteAddress, req.url));    // Create and save record 
      
    proxy.proxyRequest(req, res, {    // make proxy request after saving record
      host: req.headers['host'],
      port: 80
    });

  } else { res.end(); } 
  
});

/* Start Proxy */
server.listen(PROXY_PORT, function() {
  console.log("HTTP Proxy listening on port " + PROXY_PORT);
});
