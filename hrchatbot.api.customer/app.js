// import http from 'http'
// import express from 'express'
//
// import logger from 'morgan';
// import bodyParser from 'body-parser';
// import routes from './server/routes';
//
// const hostname = '127.0.0.1';
// const port = 3000;
// const app = express();
// const server = http.createServer(app);
//
// app.use(logger('dev'));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
//
//
// routes(app);
//
// // app.get('*', (req, res) => res.status(200).send({
// //     message: 'Welcome to ChatBot Node.js API.',
// // }));
//
// server.listen(port, hostname, () => {
//     console.log(`Server running at http://${hostname}:${port}/`);
// });

'use strict';

var express = require('express'); // app server
var bodyParser = require('body-parser'); // parser for post requests
var AssistantV2 = require('ibm-watson/assistant/v2'); // watson sdk

var app = express();

// Bootstrap application settings
app.use(express.static('./public')); // load UI from public folder
app.use(bodyParser.json());

// Create the service wrapper

var assistant = new AssistantV2({
    version: '2018-11-08'
});

var newContext = {
    global : {
        system : {
            turn_count : 1
        }
    }
};

// IMPORTANT: THIS ONE SENDS THE USER MESSAGE/REQUEST TO WATSON API/ I think?
// Endpoint to be call from the client side
app.post('/api/message', function (req, res) {
    var assistantId = process.env.ASSISTANT_ID || '<assistant-id>';
    if (!assistantId || assistantId === '<assistant-id>>') {
        return res.json({
            'output': {
                'text': 'The app has not been configured with a <b>ASSISTANT_ID</b> environment variable. Please refer to the ' + '<a href="https://github.com/watson-developer-cloud/assistant-simple">README</a> documentation on how to set this variable. <br>' + 'Once a workspace has been defined the intents may be imported from ' + '<a href="https://github.com/watson-developer-cloud/assistant-simple/blob/master/training/car_workspace.json">here</a> in order to get a working application.'
            }
        });
    }
    var contextWithAcc = (req.body.context) ? req.body.context : newContext;

    if (req.body.context) {
        contextWithAcc.global.system.turn_count += 1;
    }

    //console.log(JSON.stringify(contextWithAcc, null, 2));

    var textIn = '';

    if(req.body.input) {
        textIn = req.body.input.text;
    }

    var payload = {
        assistant_id: assistantId,
        session_id: req.body.session_id,
        context: contextWithAcc,
        input: {
            message_type : 'text',
            text : textIn,
            options : {
                return_context : true
            }
        }
    };

    // Send the input to the assistant service
    assistant.message(payload, function (err, data) {
        if (err) {
            const status = (err.code  !== undefined && err.code > 0)? err.code : 500;
            return res.status(status).json(err);
        }
        return res.json(data);
    });
});


app.get('/api/session', function (req, res) {
    assistant.createSession({
        assistant_id: process.env.ASSISTANT_ID || '{assistant_id}',
    }, function (error, response) {
        if (error) {
            return res.send(error);
        } else {
            return res.send(response);
        }
    });
});

module.exports = app;