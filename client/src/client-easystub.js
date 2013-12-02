(function (context, factory) {
    var name = 'easystub', io = context.io;
    context[name] = factory(io);
}(window, function (io) {
    'use strict';

    var socket = null, connection = null, events = [];

    // connection de socket.io
    socket = io
        .connect('//' + window.location.host.split(':')[0] + ':__PORT__');

    // reception des donnees
    socket.on('service-rx', function (data) {
        var i;

        if (events[data.type]) {
            for (i = 0; i < events[data.type].length; i++) {
                events[data.type][i](data.data);
            }
        }
    }).on('change-service-rx', function (data) {
        var i, evtName = 'change-' + data.type;

        if (events[data.type]) {
            for (i = 0; i < events[evtName].length; i++) {
                events[evtName][i](data.data);
            }
        }
    }).on('removed-service-rx', function (type) {
        var i, evtName = 'remove-' + type;

        if (events[data.type]) {
            for (i = 0; i < events[evtName].length; i++) {
                events[evtName][i]();
            }
        }
    }).on('error', function (err) {
        throw 'EasyStub.js error';
    });

    connection = {
        send: function (type, data, status) {
            socket.emit('service-rx', {
                type: type,
                data: data,
                status: status || 200
            });

            return connection;
        },
        remove: function (type) {
            socket.emit('remove-service-rx', type);

            return connection;
        },
        on: function (event, callback) {
            if (!events[event]) {
                events[event] = [];
            }

            events[event].push(callback);
        }
    };

    return connection;
}));
