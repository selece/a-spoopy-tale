'use strict';

// imports
const minimist = require('minimist')(process.argv.slice(2));
const express = require('express');
const winston = require('winston');
const moment = require('moment');

// server setup
const app = require('express')();
const server = require('http').Server(app);

// winston debug setup
if (process.env.NODE_ENV === 'test') {
    winston.level = 'silly';

} else {
    winston.level = 'debug';
}

winston.default.transports.console.colorize = true;

// middleware setups
app.use(express.static('assets'));
app.set('view engine', 'pug');
app.set('views', './views');

// server startup
server.listen(minimist.port);
winston.log('info', 'Server has been started on port', minimist.port);

// express routing
app.get('/', (req, res) => {
    winston.log('info', 'Serving /.');
    res.render('index', {

    });
});

// exports
module.exports = app;