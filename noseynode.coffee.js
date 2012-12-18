require 'date-utils'

createRecord = (addr, url) ->
  console.log "In createRecord"
  {"remote_addr": addr, "url": url, "dtg": Date.today()}

getData = ->
  console.log "Inside getData"
  db.newcollection.find (err, newcollection) ->
    if err or !newcollection
      console.log "Nothing found"

PROXY_PORT = 8888
MONGO_SERVER_IP = "192.168.1.2"

mongojs = require 'mongojs'

db = mongojs "192.168.1.2:27017/noseynode2", ["newcollection"], (err,db) ->
  if err
    console.log "error connecting" 
  else console.log "here"

httpProxy = require 'http-proxy' # npm install http-proxy

server = httpProxy.createServer (req, res, proxy) ->
  
  if req.headers['host']?
    db.newcollection.save createRecord(req.connection.remoteAddress, req.url), (err, saved) ->
      if (err || !saved)
          console.log "not saved because err:#{err}"
    
    proxy.proxyRequest req, res,
      host: req.headers['host']
      port: 80
  else
    res.end()

server.listen PROXY_PORT, ->
  console.log "Http Proxy listening on port #{PROXY_PORT}"

http = require 'http'
gui_server = http.createServer (req,res) ->
  res.writeHead 200, {'Content-Type': 'text/plain'}
  res.write 'Worked\n'
  res.end()

gui_server.listen 9999, '0.0.0.0'
