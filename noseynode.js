function createRecord(addr, url){
  var record = {
    "remote_address": addr,
    "url": url
  }
  console.log(record);
  return record;
}

(function() {
  var PROXY_PORT, httpProxy, server;
  PROXY_PORT = 8888;

/* Setup MongoDB */
  var databaseUrl = "mongodb://localhost:27017/noseynode";
  var collections = ["nnc"];
  var db = require("mongojs").connect(databaseUrl, collections, function(err,db){
    if (err) console.log("error");
  });

/* Setup Proxy */
  httpProxy = require('http-proxy');
  server = httpProxy.createServer(function(req, res, proxy) {
    var full_url, location, query;

    full_url = "http://" + req.headers['host'] + req.url;

    if (req.headers['host'] != null) {
      
      db.nnc.save(createRecord(req.connection.remoteAddress, req.url));     
      proxy.proxyRequest(req, res, {
        host: req.headers['host'],
        port: 80
      });
    } else {
      res.end();
    } 
  });

/* Start Proxy */
  server.listen(PROXY_PORT, function() {
    console.log("HTTP Proxy listening on port " + PROXY_PORT);
  });

}).call(this);
