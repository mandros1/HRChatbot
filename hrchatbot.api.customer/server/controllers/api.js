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
        sessionID: getSessionID,
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
            // console.log(`getResponsePayload: ${JSON.stringify(responsePayload)}`);
            return responsePayload;
        },
        setResponsePayload: function(newPayloadStr) {
            // console.log(`setResponsePayload: ${JSON.stringify(newPayloadStr)}`);
            responsePayload = JSON.parse(newPayloadStr);
        },
        setErrorPayload: function() {
        }
    };


    function getSessionStatusCode() {
        return sessionStatusCode;
    }

    function setSessionStatusCode(sessionCode) {
        sessionStatusCode = sessionCode;
    }

    function getSessionID() {
        return sessionId;
    }

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

            // console.log(`Status code ${res.statusCode}`);

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


    async function sendMessageToAssistant(options, text, context) {
        // console.log('SENDING MESSAGE');
        // Build request payload
        let payloadToWatson = {
            session_id: sessionId
        };

        payloadToWatson.input = {
            message_type: 'text',
            text: text,
        };

        if (context) payloadToWatson.context = context;
        // console.log('Sending HTTP request');


        const instance = axious.create({baseURL: 'http://localhost:3000'});
        const headers = {
            'Content-Type': 'application/json',
                accept: 'application/json'
        };

        let smth = await instance.post(
            messageEndpoint,
            payloadToWatson,
            {headers: headers})
            .then(function (response) {
                console.log(`SETTING RESPONSE PAYLOAD TO: ${JSON.stringify(response.data)}`);
                Api.setResponsePayload(JSON.stringify(response.data));
            })
            .catch(function(error){
                console.log(error);
            })
            .finally(function () {
                // console.log('Finally block');
                if (Object.getOwnPropertyNames(payloadToWatson).length !== 0) {
                    Api.setRequestPayload(JSON.stringify(payloadToWatson));
                }
            })

        // let smth = await instance.get(sessionEndpoint)
        //         .then(function (response) {
        //             console.log(response.data);
        //             Api.setResponsePayload(JSON.stringify(response.data));
        //         })
        //         .catch(function(error){
        //             console.log(error);
        //         })
        //         .finally(function () {
        //             console.log('Finally block');
        //             //Api.setRequestPayload(payloadToWatson);
        //         })


            // let x = await httpObject.request(options, (res) => {
            //     console.log('Insides
            //     res.on('data', async (d) => {
            //
            //         let data = JSON.parse(d);
            //         console.log('before setting response payload');
            //         await Api.setResponsePayload(JSON.stringify(data));
            //         console.log('after setting response payload');
            //     });
            //
            //     res.on('end', () => {
            //         console.log('Finished');
            //     });
            //
            //     res.on('error', (error) => {
            //         console.log(`Error has occurred: ${error}`);
            //         Api.setErrorPayload({
            //             'output': {
            //                 'generic': [
            //                     {
            //                         'response_type': 'text',
            //                         'text': 'Ups, nešto je pošlo po krivu, molimo Vas da osvježite stranicu, hvala.'
            //                     }
            //                 ],
            //             }
            //         });
            //     });
            // });
            // console.log('Done with the HTTP request');
            // let bodyParams = JSON.stringify(payloadToWatson);
            // x.write(bodyParams);
            //
            // if (Object.getOwnPropertyNames(payloadToWatson).length !== 0) {
            //     Api.setRequestPayload(bodyParams);
            // }
            //
            // x.end();

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
