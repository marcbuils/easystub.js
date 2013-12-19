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
- NodeJS API to set a custom stub server


#### Prerequisite ####

> _To execute at least one time_

```bash
npm install easystub.js --savedev
```


## module for grunt-contrib-connect ##

This module create the stub server.

### Usage ###

> _Add this lines in your Gruntfiles.js_

Example:  
```javascript
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
```

### Options ###

- stubsFile: path to the configuration file

### Configuration file ###

The configuration file is a JSON file composed of regular expressions matching URLs and 
key data to be returned in the HTTP request value.

Example:  
```json
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
``` 


## CasperJS API ##

With Easystub.js API for CasperJS, you can control the data returned by the stub, from your CasperJS tests.

### Functions ###

- casper.startInterceptor(urlExp, data): Start or change a stub
- casper.stopInterceptor(urlExp): Stop a stub

### Usage ###

> _Add this lines in your CasperJS test files_

Example:  
```javascript
'use strict';

// Add startInterceptor and stopInterceptor to casper
require('../../node_modules/easystub.js/client/src/casper-interceptor.js')(
    casper);

casper.test
    .begin(
        'Your casper test',
        function (test) {
            casper
                .start('http://localhost:8000/index.html', function () {
                	// Load a page before use Easystub.js API
                    this.waitForSelector('body', function () {});
                })
                .then(function () {
                	// Change values of default stubs
                	this.startInterceptor('^/services/my-service$', {
       	 				"my_custom_data_1": 1,
        				"my_custom_data_2": 1
                	});
                                
                	// Or create new stubs
                	this.startInterceptor('^/services/my-new-service$', {
                    	"name": "Hello world"
                	});
                })
                .then(function () {
                    // your casper tests here
                })
                .then(function () {
                    // change values of started stub
                	this.startInterceptor('^/services/my-service$', {
       	 				"my_custom_data_1": 2,
        				"my_custom_data_2": 2
                	});          
                })
                .then(function () {
                    // your casper tests here
                })
                .then(function () {
                	// stop stubs
                	this.stopInterceptor('^/services/my-service$');
                	this.stopInterceptor('^/services/my-new-service$');
          		})
          		.run(function () {
                    test.done();
                });
        });
```


## Javascript API ##

With Easystub.js API for Javascript, you can control the data returned by the stub, from your HTML IHM.


#### Prerequisite ####

> _Add this lines in your HTML file_

```html
<!-- load socket.io api -->
<script src="/socket.io/socket.io.js"></script>

<!-- load Easystub.js api -->
<script src="/easystub.js"></script>
```


### Functions ###

- easystub.send(urlExp, data): Start or change a stub
- easystub.remove(urlExp): Stop a stub


### Usage ###

> _Use it in HTML or a Javascript file_

Example:  
```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>Easystub.js test</title>
		
		<script src="/socket.io/socket.io.js"></script>
		<script src="/easystub.js"></script>
		
		<script src="//code.jquery.com/jquery-1.10.2.min.js"></script>
	</head>
	<body>
		<input type="button" data-action="change" value="change"/>
		<input type="button" data-action="stop" value="stop"/>
		
		<script>
			$('[data-action="change"]').click(function () {
				easystub.send('^/services/my-service$', {
       	 			"my_custom_data_1": 1,
        			"my_custom_data_2": 1
                });
			});

			$('[data-action="stop"]').click(function () {
				easystub.remove('^/services/my-service$');
			});
		</script>
	</body>
</html>
```


## NodeJS API ##

With Easystub.js API for NodeJS, you can create and manage an Easystub.js server from NodeJS.

> _Warning: Client files "/easystub.js" and "/socket.io/socket.io.js" are not share with this API_
> _Warning: The default stub don't work with this API_
> _Warning: The Casper API don't work with this API_

### Functions ###

- listen(port): Start the easystub.js server (websocket)
- has(urlExp): Return if a stub is registered or not
- get(urlExp): Return the data register for the gived regulary expression
- getList(): Return all register stubs


### Usage ###

Example:  
```javascript
var serverEasyStub = require('easystub.js').server;
var express = require('express');
var app = express();

app.get('/my-service', function(req, res){
  var stub;
  
  if (serverEasyStub.has('/my-service')) {
  	stub = serverEasyStub.get('/my-service');
  	res.send(stub.data);
  } else {
  	res.send('hello world');
  }
});

app.listen(3000);
serverEasyStub.listen(3001);
```