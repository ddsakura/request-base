var rb = require('../index'),
    server = require('./server'),
    assert = require('assert'),
    s = server.createServer(8080),
    done = function () {
        s.close();
    };

s.listen(s.port, function () {
    s.on('/getJson123', function (req, resp) {
        resp.writeHead(200, {'content-type':'application/json'})
        resp.write(JSON.stringify({
            key: '123'
        }));
        resp.end()
    });

    s.on('/getJson321', function (req, resp) {
        resp.writeHead(200, {'content-type':'application/json'})
        resp.write(JSON.stringify({
            key: '321'
        }));
        resp.end()
    });
});

describe('io succues test', function(){
  describe('json', function(){
    it('should return json 123', function(){
        var r = rb.io({
            uri: 'http://localhost:8080/getJson123'
        }, function (e, resp) {
            assert.equal(resp, '{"key":"123"}');
        });
    });
    it('should return json 321', function(){
        var r = rb.io({
            uri: 'http://localhost:8080/getJson321'
        }, function (e, resp) {
            assert.equal(resp, '{"key":"321"}');
            done();
        });
    });
  })
})