/*jslint node:true */
"use strict";

var requestBatches = {},
    requestCache = {},
    request = require('request'),
    io = function (args, callback) {
        var value,
            callbacks,
            i;
        args = args || {};
        args.uri = args.uri || 'http://mikeal.iriscouch.com/testjs/111';
        args.method = args.method || 'GET';

        // Cache the result if no error and flush batch
        function onSuccess(err, msg) {
            if (!err) {
                requestCache[args.uri] = msg;
            }
            delete requestBatches[args.uri];
            for (i = 0; i < callbacks.length; i += 1) {
                if (callback) {
                    callbacks[i](err, msg);
                }
            }
        }

        if (requestCache.hasOwnProperty(args.uri)) {
            value = requestCache[args.uri];
            // Behave asynchronously by delaying until next tick
            process.nextTick(function () {
                if (callback) {
                    callback(null, value);
                }
            });
            return;
        }

        if (requestBatches.hasOwnProperty(args.uri)) {
            requestBatches[args.uri].push(callback);
            return;
        }

        callbacks = requestBatches[args.uri] = [callback];

        request({
            method: args.method,
            uri: args.uri
        }, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                onSuccess(null, body);
            } else {
                console.log('error: ' + response.statusCode);
            }
        });
    };

module.exports = {
    io: io
};