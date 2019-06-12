// The Api module is designed to handle all interactions with the server

let Api = (function() {
    let requestPayload;
    let responsePayload;

    // API endpoints
    let messageEndpoint = '/api/message';
    let sessionEndpoint = '/api/session';

    // user sessionId variable initialization
    let sessionId = null;


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
        let http = new XMLHttpRequest();
        http.open('GET', sessionEndpoint, true);
        http.setRequestHeader('Content-type', 'application/json');
        http.onreadystatechange = function () {
            if (http.readyState === XMLHttpRequest.DONE) {
                let res = JSON.parse(http.responseText);
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
        // Build request payload
        let payloadToWatson = {
            session_id: sessionId
        };

        payloadToWatson.input = {
            message_type: 'text',
            text: text,
        };

        if (context) payloadToWatson.context = context;


        // IMPORTANT this sends the POST request to the Watson Assistant and gets back the ResponsePayload
        // Built http request
        let http = new XMLHttpRequest();
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
        let params = JSON.stringify(payloadToWatson);
        // Stored in variable (publicly visible through Api.getRequestPayload)
        // to be used throughout the application
        if (Object.getOwnPropertyNames(payloadToWatson).length !== 0) {
            Api.setRequestPayload(params);
        }

        // Send request
        http.send(params);
    }
}());
