/*jslint node:true, unparam:true */
/*global  describe, it*/

"use strict";

var rb = require('../index'),
    assert = require('assert'),
    nock = require('nock');

nock('http://localhost:8080').get('/getJson123').reply(200, '{"key":"123"}');
nock('http://localhost:8080').get('/getJson321').reply(200, '{"key":"321"}');
nock('http://localhost:8080').get('/getStatus500').reply(500);

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
