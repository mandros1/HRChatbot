// The Api module
let Api = (function() {
    const httpObject= require('http');
    const axious = require('axios');

    const API_PORT=3000;
    const API_HOST='localhost';

    // API endpoints
    let messageEndpoint = '/api/message';
    let sessionEndpoint = '/api/session';

    // user sessionId variable initialization
    let sessionId = null;
    let sessionStatusCode = null;
    let requestPayload;
    let responsePayload;


    // Publicly accessible methods defined
    return {
        sendRequest: sendRequest,
        getSessionId: getSessionId,
        // sessionID: getSessionID,
        sessionStatusCode: getSessionStatusCode,

        // The request/response getters/setters are defined here to prevent internal methods
        // from calling the methods without any of the callbacks that are added elsewhere.
        getRequestPayload: function() {
            return requestPayload;
        },
        setRequestPayload: function(newPayloadStr) {
            requestPayload = JSON.parse(newPayloadStr);
        },
        getResponsePayload: function() {
            return responsePayload;
        },
        setResponsePayload: function(newPayloadStr) {
            responsePayload = JSON.parse(newPayloadStr);
        },
        // setErrorPayload: function() {
        // }
    };


    function getSessionStatusCode() {
        return sessionStatusCode;
    }

    function setSessionStatusCode(sessionCode) {
        sessionStatusCode = sessionCode;
    }

    // function getSessionID() {
    //     return sessionId;
    // }

    function generateHttpOptions(path, method) {
        return {
            host: API_HOST,
            port: API_PORT,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
                accept: 'application/json'
            }
        }
    }

    /**
     * Function that handles returning the current api specified session and setting
     * it to the sessionId variable as its value
     * @param callback function
     */
    function getSessionId(callback) {

        let options = generateHttpOptions(sessionEndpoint, 'GET');

        let x = httpObject.request(options,(res) => {

            res.on('data', (d) => {
                let object = JSON.parse(d);
                sessionId = object.session_id;
                setSessionStatusCode(res.statusCode);
            });

            res.on('end', () => {
                callback();
            });

            res.on('error', (error) => {
                console.log(`Error has occurred: ${error}`);
            });
        });
        x.end();
    }

    /**
     * Function that sends the payload with question, context and options to the Watson Assistant in the form
     * of the POST request and sets the response, as well as the request, to the payload of the Api
     * @param options
     * @param text user typed in data
     * @param context previous answer/s from the Watson Assistant (context of the conversation)
     * @return {Promise<void>}
     */
    async function sendMessageToAssistant(options, text, context) {

        // set a session ID to the payload
        let payloadToWatson = {
            session_id: sessionId
        };

        // set message to the payload
        payloadToWatson.input = {
            message_type: 'text',
            text: text,
        };

        // if the previous context of conversation exists, add it in too
        if (context) payloadToWatson.context = context;


        const instance = axious.create({baseURL: `http://${API_HOST}:${API_PORT}`});
        const headers = {
            'Content-Type': 'application/json',
                accept: 'application/json'
        };

        let smth = await instance.post(
            messageEndpoint,
            payloadToWatson,
            {headers: headers})
            .then(function (response) {
                // set a response from the Asistant in the response
                Api.setResponsePayload(JSON.stringify(response.data));
            })
            .catch(function(error){
                console.log(error);
            })
            .finally(function () {
                if (Object.getOwnPropertyNames(payloadToWatson).length !== 0) {
                    Api.setRequestPayload(JSON.stringify(payloadToWatson));
                }
            })


    }


    /**
     * Used both to update request and response payload when user sends a message to the
     * Watson Assistant we handle that message here (Send a message request to the server)
     * @param text is the string representing user question/response
     * @param context is the WA context previous to the asked question/provided response by the user
     */
    async function sendRequest(text, context) {
        let options = generateHttpOptions(messageEndpoint, 'POST');
        await sendMessageToAssistant(options, text, context);
    }
}());
 module.exports = Api;
