'use strict';

var self = null;

self = {
    io: null,
    _services: {},
    _sockets: [],

    listen: function (server) {
        self.io = require('socket.io').listen(server);

        self.io.sockets.on('connection', function (socket) {
            self._sockets.push(socket);

            socket.on('service-rx', function (data) {
                var type = null;

                if (data.type === undefined) {
                    return;
                }

                type = data.type;
                self._services[type] = data;

                self._send('change-service-rx', data);
            }).on('remove-service-rx', function (type) {
                if (self._services[type] === undefined) {
                    return;
                }

                delete self._services[type];

                self._send('removed-service-rx', type);
            });
        });

        return this;
    },
    has: function (service) {
        return self._services[service] !== undefined;
    },
    get: function (service) {
        return self._services[service];
    },
    getList: function () {
        var services = [];
        var stub;

        for (stub in self._services) {
            if (self._services.hasOwnProperty(stub)) {
                services.push(stub);
            }
        }

        return services;
    },
    _send: function (type, data) {
        self._sockets.forEach(function (socket) {
            socket.emit(type, data);
        });
    }
};

module.exports = self;
