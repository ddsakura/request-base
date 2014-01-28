/*jslint node:true, unparam:true */
/*global  describe, it*/

"use strict";
var http = require('http');

module.exports = {
    createServer: function (port) {
        port = port || 6767;
        var s = http.createServer(function (req, resp) {
            s.emit(req.url, req, resp);
        });
        s.port = port;
        s.url = 'http://localhost:' + port;
        return s;
    }
};