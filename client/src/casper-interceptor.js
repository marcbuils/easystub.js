casper.startInterceptorBase = function (type, data, httpStatus) {
    var status;
    status = (httpStatus === undefined ? 200 : httpStatus);
    this.evaluate((function (type, data, status) {
        var connection;
        connection = "/stubs-ihm/js/connection.js";
        return require([
            connection
        ], function (connection) {
            return connection.send(type, data, status);
        });
    }), {
        type: type,
        data: data,
        status: status
    });
    return this.wait(500);
};

/*
Intercepte un stub pour forcer le contenu
@param type    nom du service
@param data    Liste des données à modifier
@param httpStatus    (optionnel) Le status http. Par défaut 200.

Attention : il faut utiliser un `casper.then` après la fonction car elle est asynchrone.

Exemple d'utilisation
casper.then ->
  @startInterceptor '/account/client/1/session', {}, 204

casper.then ->
  # Du code ici
*/
casper.startInterceptor = function (type, data, httpStatus) {
    return this.startInterceptorBase(type, data, httpStatus);
};

/*
Supprime l'interception d'un stub
@param type    nom du service

Attention : il faut utiliser un `casper.then` après la fonction car elle est asynchrone.

Exemple d'utilisation

casper.then ->
  @stopInterceptor '/account/client/1/session'

casper.then ->
  # Du code ici
*/
casper.stopInterceptor = function (type) {
    this.evaluate((function (type) {
        var connection;
        connection = "/stubs-ihm/js/connection.js";
        return require([
            connection
        ], function (connection) {
            return connection.remove(type);
        });
    }), {
        type: type
    });
    return this.wait(500);
};

exports = module.exports = stubs;
