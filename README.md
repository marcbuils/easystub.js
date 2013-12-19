# easystub.js

> _EasyStub.js - a simple stubbing framework for javascript_ 
(EasyStub.js stubs only JSON services)


---------------------------------------

## Requirements

- [grunt-contrib-connect](https://github.com/gruntjs/grunt-contrib-connect) ```npm install --save-dev grunt-cli```


## Optionals

- [CasperJS](http://docs.casperjs.org/en/latest/installation.html#installing-from-git) ```npm install -g capserjs```

---------------------------------------


## Composition
- module for grunt-contrib-connect
- CasperJS API to modify stubs from a casper test
- Javascript API to modify stubs from an HTML page


## module for grunt-contrib-connect ##
This module create the stub server.

### Usage ###
> _Add this lines in your Gruntfiles.js_

'''javascript
grunt.initConfig({
    connect: {
        dev: {
            options: {
                port: 8000,
                middleware: function (connect) {
                    return [
                        connect.static(require('path').resolve('app/')),
                        
                        /* The following lines add Easystub server */ 
                        require('easystub.js').connect({
                            stubsFile: 'conf/stubs.json'
                        })
                        /* End */
                    ];
                }
            }
        }
    }
});
'''

### Options ###
- stubsFile: path to the configuration file

### Configuration file ###
The configuration file is a JSON file composed of regular expressions matching URLs and 
key data to be returned in the HTTP request value.

Exemple:
'''json
{
    "^/services/my-service$": {
        "my_custom_data_1": 123,
        "my_custom_data_2": 456
    },
    "^/services/my-second-service$": {
        "my_custom_data_1": 789,
        "my_custom_data_2": 963
    }
}
''' 


## CasperJS API ##
This module create the stub server.

### Usage ###
> _Add this lines in your Gruntfiles.js_

'''javascript
grunt.initConfig({
    connect: {
        dev: {
            options: {
                port: 8000,
                middleware: function (connect) {
                    return [
                        connect.static(require('path').resolve('app/')),
                        
                        /* The following lines add Easystub server */ 
                        require('easystub.js').connect({
                            stubsFile: 'conf/stubs.json'
                        })
                        /* End */
                    ];
                }
            }
        }
    }
});
'''

### Options ###
- stubsFile: path to the configuration file

### Configuration file ###
The configuration file is a JSON file composed of regular expressions matching URLs and 
key data to be returned in the HTTP request value.

Exemple:
'''json
{
    "^/services/my-service$": {
        "my_custom_data_1": 123,
        "my_custom_data_2": 456
    },
    "^/services/my-second-service$": {
        "my_custom_data_1": 789,
        "my_custom_data_2": 963
    }
}
''' 

