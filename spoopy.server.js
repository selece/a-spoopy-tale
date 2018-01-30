'use strict';

// imports
const minimist = require('minimist')(process.argv.slice(2));
const express = require('express');
const winston = require('winston');
const random_token = require('rand-token');
const moment = require('moment');

// server setup
const app = require('express')();
const server = require('http').Server(app);
const sio = require('socket.io').listen(server);
const shared_session = require('express-socket.io-session');
const session = require('express-session')({
    secret: random_token.generate(64),
    resave: true,
    saveUninitialized: true,
});

// winston debug setup
if (process.env.NODE_ENV === 'test') {
    winston.level = 'silly';

} else {
    winston.level = 'debug';
}

winston.default.transports.console.timestamp =  () => {
    return moment().format('MMMM Do YYY, h:mm:ss a');
};

winston.default.transports.console.colorize = true;

// middleware setups
app.use(session);
app.use(express.static('assets'));

sio.use(shared_session(session, {
    autoSave: true,
}));

app.set('view engine', 'pug');
app.set('views', './views');

// server startup
server.listen(minimist.port);
winston.log('info', 'Server has been started on port', minimist.port);
server.timer = minimist.timer;

// server heartbeat
const server_heartbeat_tick = () => {
    server.timer -= 1;
    sio.emit('ev_server', {
        type: 'tick',
        data: moment()
                .startOf('day')
                .seconds(server.timer)
                .format('H:mm:ss')
    });
};

let server_heartbeat_tick_ref = null;

// express routing
app.get('/', (req, res) => {
    res.render('index', {});
});

// socket.io handlers
sio.on('connection', (socket) => {
    winston.log('info', 'New connection requested.');

    // initial connect, set up gamestate
    if (!socket.handshake.session.exists) {
        winston.log('debug', 'Client has no saved session, creating new session.');

        socket.handshake.session.exists = true;
        socket.handshake.session.save();
    
    } else {
        winston.log('debug', 'Client has previous session, restoring session.');
    }

    // handle client events
    socket.on('ev_client', (type, data) => {
        winston.log('debug', 'Received from client: ', type, data);
    });
});


// exports
module.exports = app;