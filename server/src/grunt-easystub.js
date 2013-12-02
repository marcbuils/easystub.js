'use strict';

var serverEasyStub = require('./server-easystub');
var portscanner = require('portscanner');
var ports = [
    7001,
    8000
];
var exports;

exports = function (options) {
    var _module;

    _module = {
        _port: null,
        _response: function (res, type, data) {
            res.setHeader('Content-type', type);
            res.setHeader('Expires', 'Mon, 26 Jul 1997 05:00:00 GMT');
            res.setHeader('Cache-Control', 'no-cache, must-revalidate');
            res.setHeader('Pragma', 'no-cache');

            res.end(data);
        },
        initialize: function () {
            portscanner.findAPortNotInUse(ports[0], ports[1], 'localhost',
                function (error, port) {
                    _module.port = port;

                    console
                        .log("Port used for EasyStub.js: " + port.toString());
                    serverEasyStub.listen(_module.port);
                });
        },
        server: function (req, res, next) {
            var stubs = options.stubs || {};
            var found = false;
            var stub;

            if (req.originalUrl === "/easystub.js") {
                _module._response(res, 'text/javascript', require('fs')
                    .readFileSync(
                        __dirname + '/../../client/src/client-easystub.js',
                        'utf8').replace(/__PORT__/gi, _module.port));
                found = true;
            }

            if (req.originalUrl === "/socket.io/socket.io.js") {
                _module
                    ._response(
                        res,
                        'text/javascript',
                        require('fs')
                            .readFileSync(
                                __dirname
                                    + '/../../node_modules/socket.io/node_modules/socket.io-client/dist/socket.io.min.js',
                                'utf8').replace(/__PORT__/gi, _module.port));
                found = true;
            }

            if (!found) {
                serverEasyStub.getList().forEach(
                    function (stub) {
                        if (new RegExp(stub).test(req.originalUrl)) {
                            _module._response(res, 'application/json', JSON
                                .stringify(serverEasyStub.get(stub).data));
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
                            _module._response(res, 'application/json', JSON
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
    _module.initialize();

    return _module.server;
};

module.exports = exports;
