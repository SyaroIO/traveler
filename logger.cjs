const { Server } = require('ws');
new Server({ port: 8080, host: '0.0.0.0' }).on('connection', session => {
    console.log('connection');
    session.on('message', m => {
        const {level, args} = JSON.parse(m);
        console[level](...args);
    });
});