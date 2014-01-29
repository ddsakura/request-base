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
        if (!args.uri) {
            callback(new Error("no uri in args."));
            return;
        }
        args.method = args.method || 'GET';
        args.headers = args.headers || {};

        // Cache the result if no error and flush batch
        function onRequest(err, msg) {
            if (!err) {
                requestCache[args.uri] = msg;
            }
            delete requestBatches[args.uri];
            for (i = 0; i < callbacks.length; i += 1) {
                if (typeof callbacks[i] === 'function') {
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
            uri: args.uri,
            headers: args.headers
        }, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                onRequest(null, body);
                return;
            }
            if (!error && response.statusCode !== 200) {
                onRequest(new Error(response.statusCode));
                return;
            }
            if (error) {
                onRequest(error);
                return;
            }
        });
    };

module.exports = {
    io: io
};