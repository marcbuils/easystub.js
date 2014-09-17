'use strict';

var self = null;

self = {
    io: null,
    _services: {},
    _sockets: [],

    listen: function (server) {
        self.io = require('socket.io').listen(server, {
            'log level': 1
        });

        self.io.sockets.on('connection', function (socket) {
            self._sockets.push(socket);

            socket.on('service-rx', function (data) {
                this.set(data);
            }).on('remove-service-rx', function (type) {
                this.remove(type);
            });
        });

        return this;
    },

    set: function (data) {
        if (data.type === undefined) {
            return;
        }

        self._services[data.type] = data;
        self._send('change-service-rx', data);
    },

    remove: function (type) {
        if (self._services[type] === undefined) {
            return;
        }

        delete self._services[type];

        self._send('removed-service-rx', type);
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
