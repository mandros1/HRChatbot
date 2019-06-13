// The Api module
var Api = (function() {
    var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
    const httpObject= require('http');
    var requestPayload;
    var responsePayload;

    // API endpoints
    var messageEndpoint = '/api/message';
    var sessionEndpoint = '/api/session';

    // user sessionId variable initialization
    var sessionId = null;


    // Publicly accessible methods defined
    return {
        sendRequest: sendRequest,
        getSessionId: getSessionId,

        // The request/response getters/setters are defined here to prevent internal methods
        // from calling the methods without any of the callbacks that are added elsewhere.
        getRequestPayload: function() {
            console.log(`getRequestPayload: ${JSON.stringify(requestPayload)}`);
            return requestPayload;
        },
        setRequestPayload: function(newPayloadStr) {
            console.log(`setRequestPayload: ${JSON.stringify(newPayloadStr)}`);
            requestPayload = JSON.parse(newPayloadStr);
        },
        getResponsePayload: function() {
            console.log(`getResponsePayload: ${JSON.stringify(responsePayload)}`);
            return responsePayload;
        },
        setResponsePayload: function(newPayloadStr) {
            console.log(`setResponsePayload: ${JSON.stringify(newPayloadStr)}`);
            responsePayload = JSON.parse(newPayloadStr);
        },
        setErrorPayload: function() {
        }
    };


    /**
     * Function that handles returning the current api specified session and setting
     * it to the sessionId variable as its value
     * @param callback function
     */
    function getSessionId(callback) {
        console.log('getSessionId called');

        var options = {
            host: 'localhost',
            port: 3000,
            path: '/api/session',
            method: 'GET',
            headers: {
                accept: 'application/json'
            }
        };

        console.log("Start");
        var x = httpObject.request(options,function(res){
            console.log("Connected");
            let data = '';

            res.on('data',(chunk => {
                let object = JSON.parse(chunk);
                // data += object.session_id;
                sessionId = object.session_id;
            }));

            console.log(`Data is: ${data}`);

            res.on('end', () => {
                console.log(`End data is: ${JSON.parse(data).explanation}`);
            });
        });

        x.end();

        // NOT WORKING WITHOUT SSL CERTIFICATE
        // https.get('127.0.0.1:3000/api/session', (resp) =>{
        //    let data='';
        //
        //    resp.on('data', (chuck) => {
        //       data += chuck;
        //    });
        //
        //     resp.on('end', () => {
        //         console.log(JSON.parse(data).explanation);
        //     });
        //     console.log(`Data in HTTPS is ${data}`);
        // }).on("error", (err) => {
        //     console.log("Error: " + err.message);
        // });

        var http = new XMLHttpRequest();
        http.open('GET', sessionEndpoint, true);
        http.setRequestHeader('Content-type', 'application/json');
        http.onreadystatechange = function () {
            if (http.readyState === XMLHttpRequest.DONE) {
                var res = JSON.parse(http.responseText);
                console.log(res.session_id);
                sessionId = res.session_id;
                callback();
            }
        };
        http.send();
    }

    /**
     * Used both to update request and response payload when user sends a message to the
     * Watson Assistant we handle that message here (Send a message request to the server)
     * @param text is the string representing user question/response
     * @param context is the WA context previous to the asked question/provided response by the user
     */
    function sendRequest(text, context) {
        console.log(`sendRequest: ${text} and with ${context}`);
        // Build request payload
        var payloadToWatson = {
            session_id: sessionId
        };

        payloadToWatson.input = {
            message_type: 'text',
            text: text,
        };

        if (context) payloadToWatson.context = context;


        // IMPORTANT this sends the POST request to the Watson Assistant and gets back the ResponsePayload
        // Built http request
        var http = new XMLHttpRequest();
        http.open('POST', messageEndpoint, true);
        http.setRequestHeader('Content-type', 'application/json');
        http.onreadystatechange = function() {
            if (http.readyState === XMLHttpRequest.DONE && http.status === 200 && http.responseText) {
                Api.setResponsePayload(http.responseText);
            } else if (http.readyState === XMLHttpRequest.DONE && http.status !== 200) {
                Api.setErrorPayload({
                    'output': {
                        'generic': [
                            {
                                'response_type': 'text',
                                'text': 'Ups, nešto je pošlo po krivu, molimo Vas da osvježite stranicu, hvala.'
                            }
                        ],
                    }
                });
            }
        };

        // IMPORTANT this is where we set the newest request payload
        var params = JSON.stringify(payloadToWatson);
        // Stored in variable (publicly visible through Api.getRequestPayload)
        // to be used throughout the application
        if (Object.getOwnPropertyNames(payloadToWatson).length !== 0) {
            Api.setRequestPayload(params);
        }

        // Send request
        http.send(params);
    }
}());
 module.exports = Api;