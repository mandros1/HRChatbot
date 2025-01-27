// NEWER ONE
'use strict';
import http from 'http';
import routes from './server/routes';

require('dotenv').config({silent: true});

let app = require('./app');
const server = http.createServer(app);


const hostname = process.env.NODE_SERVER_HOST;
const port = process.env.NODE_SERVER_PORT || 3000;

routes(app);

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});




// /////////////////////////////////////////////////
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
