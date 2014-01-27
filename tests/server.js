/*jslint nomen:true, node:true*/
/*global describe, beforeEach, afterEach, it*/
var http = require('http');

exports.createServer = function (port) {
    port = port || 6767
    var s = http.createServer(function (req, resp) {
        s.emit(req.url, req, resp);
    })
    s.port = port
    s.url = 'http://localhost:'+port
    return s;
}

exports.createGetResponse = function (text, contentType) {
    var l = function (req, resp) {
        contentType = contentType || 'text/plain'
        resp.writeHead(200, {'content-type':contentType})
        resp.write(text)
        resp.end()
    }
    return l;
}
