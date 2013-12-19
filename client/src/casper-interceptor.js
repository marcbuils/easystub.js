var casper = {
    //    Intercepte un stub pour forcer le contenu
    //    @param type    nom du service
    //    @param data    Liste des données à modifier
    //    @param httpStatus    (optionnel) Le status http. Par défaut 200.
    //
    //    > _Attention : il faut utiliser un `casper.then` après la fonction car elle est asynchrone._
    //
    //    Exemple d'utilisation
    //    ```javascript
    //    casper.then(function () {
    //      this.startInterceptor('/account/client/1/session', {}, 204);
    //    });
    //
    //    casper.then(function () {
    //      // Du code ici
    //    });
    //    ```
    //
    startInterceptor: function (type, data, httpStatus) {
        var status;
        status = (httpStatus === undefined ? 200 : httpStatus);
        this.evaluate(function (type, data, status) {
            var loadModule;
            var root = window;

            loadModule = {
                loadScript: function (url, callback) {
                    var script = document.createElement("script");

                    script.type = "text/javascript";
                    script.onload = callback;

                    script.src = url;
                    document.getElementsByTagName("head")[0]
                        .appendChild(script);
                },

                loadSocketIO: function (callback) {
                    loadModule.loadScript('/socket.io/socket.io.js', callback);
                },
                loadEasystub: function (callback) {
                    loadModule.loadScript('/easystub.js', callback);
                },

                loadlibs: function (callback) {
                    if (!root.io) {
                        loadModule.loadSocketIO(function () {
                            loadModule.loadEasystub(callback);
                        });
                    } else if (!root.easystub) {
                        loadModule.loadEasystub(callback);
                    } else {
                        callback();
                    }
                }
            };

            loadModule.loadlibs(function () {
                root.easystub.send(type, data, status);
            });
        }, {
            type: type,
            data: data,
            status: status
        });
        return this.wait(500);
    },

    //    Supprime l'interception d'un stub
    //    @param type    nom du service
    //
    //    Attention : il faut utiliser un `casper.then` après la fonction car elle est asynchrone.
    //
    //    Exemple d'utilisation
    //
    //    casper.then(function () {
    //      this.stopInterceptor('/account/client/1/session');
    //    });
    //
    //    casper.then(function () {
    //      // Du code ici
    //    });
    //    
    stopInterceptor: function (type) {
        this.evaluate(function (type) {
            var loadModule;
            var root = window;

            loadModule = {
                loadScript: function (url, callback) {
                    var script = document.createElement("script");

                    script.type = "text/javascript";
                    script.onload = callback;

                    script.src = url;
                    document.getElementsByTagName("head")[0]
                        .appendChild(script);
                },

                loadSocketIO: function (callback) {
                    loadModule.loadScript('/socket.io/socket.io.js', callback);
                },
                loadEasystub: function (callback) {
                    loadModule.loadScript('/easystub.js', callback);
                },

                loadlibs: function (callback) {
                    if (!root.io) {
                        loadModule.loadSocketIO(function () {
                            loadModule.loadEasystub(callback);
                        });
                    } else if (!root.easystub) {
                        loadModule.loadEasystub(callback);
                    } else {
                        callback();
                    }
                }
            };

            loadModule.loadlibs(function () {
                root.easystub.remove(type);
            });
        }, {
            type: type
        });
        return this.wait(500);
    }
};

exports = module.exports = function (casperOrigin) {
    var fct;

    for (fct in casper) {
        casperOrigin[fct] = casper[fct];
    }

    return casperOrigin;
};
