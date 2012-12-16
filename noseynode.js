
(function() {
  var PROXY_PORT, PUBLIC_IP, httpProxy, server;

  httpProxy = require('http-proxy');

  PROXY_PORT = 8082;

  PUBLIC_IP = '127.0.0.1';

  server = httpProxy.createServer(function(req, res, proxy) {
    var full_url, location, query;

    full_url = "http://" + req.headers['host'] + req.url;

    if (req.headers['host'] != null) {

      console.log(req.connection.remoteAddress);
      
      proxy.proxyRequest(req, res, {
        host: req.headers['host'],
        port: 80
      });
    } else {
      res.end();
    } 
  });

  server.listen(PROXY_PORT, function() {
    console.log("HTTP Proxy listening on port " + PROXY_PORT);
  });

}).call(this);
