'use strict';

module.exports = {
    connect: require('./server/src/grunt-easystub'),
    casper: require('./client/src/casper-interceptor'),
    server: require('./client/src/server-interceptor')
};
