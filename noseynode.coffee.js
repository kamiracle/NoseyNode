require 'date-utils'

# function createRecord(addr, url){ 
#  var record = {
#    "remote_address": addr,
#    "url": url,
#	"dtg": Date.today()
#  }
#  //console.log(record);
#  return record;
#

createRecord = (addr, url) ->
   "remote_addr": addr, "url": url

#function getData(){
#  console.log("in");
#  db.nnc.find(function (err, nnc) {
#    if (err || !nnc) console.log("Nothing found");
#	else nnc.forEach (function (data){
#	  console.log(data);
#	});
#  });
#}

getData ->
  console.log "Inside getData"
  db.nnc.find = (err, nnc) ->
    if err or !nnc
      console.log "Nothing found"
    else

var PROXY_PORT  = 8888;
var MONGO_SERVER = "192.168.1.2";
var httpProxy; 
var server;

/* Setup MongoDB */
var databaseUrl = "mongodb://" + MONGO_SERVER + ":27017/noseynode2";
var collections = ["nnc"];
var db = require("mongojs").connect(databaseUrl, collections, function(err,db){
  if (err) console.log("error");
});

/* Setup Proxy */
httpProxy = require('http-proxy');
server = httpProxy.createServer(function(req, res, proxy) {
  var query;
  
  console.log(req.headers);
  
  var str = req.headers['host'];

  var newstr = str.replace(/http$/gi, "");
  
  console.log(newstr);
 
  if (req.headers['host'] != null) {
    db.nnc.save(createRecord(req.connection.remoteAddress, req.url), function(err, saved) {
	  if (err || !saved) console.log("not saved" + " " + err);
	}); // Create and save record 
      
    proxy.proxyRequest(req, res, {    // Make proxy request after saving record
      host: req.headers['host'], // Fix until I know why it was appending http at the end
      port: 80
    });

  } else { res.end(); } 
  
});

/* Setup and start admin-gui server */
var http = require('http');
http.createServer(function (req,res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.write('Worked\n');
  
  // Fetch data from MongoDB
  console.log(getData());
  res.end();
  
 
 
}).listen(9999, '127.0.0.1'); // Start listening for connections


/* Start Proxy */
server.listen(PROXY_PORT, function() {
  console.log("HTTP Proxy listening on port " + PROXY_PORT);
});
