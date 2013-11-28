'use strict';

var portscanner = require('portscanner');
var serverEasyStub = require('./server-easystub');
var exports;

exports = function (options) {
    var module;

    module = {
        _response: function (res, type, data) {
            res.setHeader('Content-type', type);
            res.setHeader('Expires', 'Mon, 26 Jul 1997 05:00:00 GMT');
            res.setHeader('Cache-Control', 'no-cache, must-revalidate');
            res.setHeader('Pragma', 'no-cache');

            res.end(data);
        },
        initialize: function () {
            var port = portscanner.findAPortNotInUse(6001, 7000, 'localhost',
                function (error, port) {
                    serverEasyStub.listen(port);
                });
        },
        server: function (req, res, next) {
            var stubs = options.stubs || {};
            var found = false;
            var stub;

            if (req.originalUrl === "/easystub.js") {
                module._response(res, 'text/javascript', JSON
                    .stringify(__dirname
                        + '/../../client/src/client-easystub.js'));
            }

            if (!found) {
                serverEasyStub.getList().forEach(
                    function (stub) {
                        if (new RegExp(stub).test(req.originalUrl)) {
                            module._response(res, 'application/json', JSON
                                .stringify(serverEasyStub.get(stub)));
                            found = true;
                        }
                    });
            }

            if (!found) {
                if (options.stubsFile) {
                    stubs = JSON.parse(require('fs').readFileSync(
                        options.stubsFile, 'utf8'));
                }

                for (stub in stubs) {
                    if (stubs.hasOwnProperty(stub)) {
                        if (new RegExp(stub).test(req.originalUrl)) {
                            module._response(res, 'application/json', JSON
                                .stringify(stubs[stub]));
                            found = true;
                        }
                    }
                }
            }

            if (!found) {
                next();
            }
        }
    };
    module.initialize();

    return module.server;
};

modules.exports = exports;
