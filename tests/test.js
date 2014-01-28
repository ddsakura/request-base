/*jslint node:true, unparam:true */
/*global  describe, it*/

"use strict";

var rb = require('../index'),
    server = require('./server'),
    assert = require('assert'),
    s = server.createServer(8080);

s.listen(s.port, function () {
    s.on('/getJson123', function (req, resp) {
        resp.writeHead(200, {'content-type': 'application/json'});
        resp.write(JSON.stringify({
            key: '123'
        }));
        resp.end();
    });

    s.on('/getJson321', function (req, resp) {
        resp.writeHead(200, {'content-type': 'application/json'});
        resp.write(JSON.stringify({
            key: '321'
        }));
        resp.end();
    });

    s.on('/getStatus500', function (req, resp) {
        resp.writeHead(500);
        resp.write('500');
        resp.end();
    });
});

describe('io test', function () {
    it('should return json 123', function (done) {
        rb.io({
            uri: 'http://localhost:8080/getJson123'
        }, function (e, resp) {
            assert.equal(resp, '{"key":"123"}');
            done();
        });
    });
    it('should return json 123 in cache', function (done) {
        rb.io({
            uri: 'http://localhost:8080/getJson123'
        }, function (e, resp) {
            assert.equal(resp, '{"key":"123"}');
            done();
        });
    });
    it('should return json 321', function (done) {
        rb.io({
            uri: 'http://localhost:8080/getJson321'
        }, function (e, resp) {
            assert.equal(resp, '{"key":"321"}');
            done();
        });
    });
    it('should return uri undefined', function (done) {
        rb.io({}, function (e, resp) {
            assert.equal(e.message, 'no uri in args.');
            done();
        });
    });
    it('should return uri error', function (done) {
        rb.io({
            uri: 'thth'
        }, function (e, resp) {
            assert.equal(e instanceof Error, true);
            done();
        });
    });
    it('should return 500 error', function (done) {
        rb.io({
            uri: 'http://localhost:8080/getStatus500'
        }, function (e, resp) {
            assert.equal(e instanceof Error, true);
            assert.equal(e.message, 500);
            done();
        });
    });
});