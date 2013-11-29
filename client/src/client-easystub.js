(function (context, factory) {
    var name = 'easystub', io = context.io;
    context[name] = factory(io);
}(window, function (io) {
    "use strict";

    var socket = null, connection = null;

    // connection de socketio
    socket = io
        .connect('//' + window.location.host.split(':')[0] + ':__PORT__');

    // reception des donnees
    socket.on('service-rx', function (data) {
        $(connection).triggerHandler(data.type, [
            data.data
        ]);
    }).on('change-service-rx', function (data) {
        $(connection).triggerHandler('change-' + data.type, [
            data.data
        ]);
    }).on('removed-service-rx', function (type) {
        $(connection).triggerHandler('removed-' + type);
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
        }
    };

    return connection;
}));
