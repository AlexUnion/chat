const express = require('express');
const http = require('http');
const socket = require('socket.io');
const { connectToDB, connection } = require('./tool/database');

const hostname = '192.168.0.100';
const port = 3000;

let usersCountOnline = 0;

const mainRouter = require('./routers/main');

const app = express();

const server = http.createServer(app);
const io = socket(server);

//configure public folder
app.use('/public', express.static(__dirname + '/public'));
app.use('/', mainRouter);

io.on('connection', (socket) => {

    console.log('user connected');
    io.emit('Users count', ++usersCountOnline);

    socket.on('chat', ({user, text}) => {
        const str = text.trim();
        if (str) {
            const query = `insert into users (name, text) values ('${user}', '${text}')`;
            connection.query(query);
            io.emit('chat', {name: user, text});
        }
    })
    socket.on('disconnect', () => {
        console.log('user disconnected');
        io.emit('Users count', --usersCountOnline);
    });
})

/*
const server = http.createServer((req, res) => {
    connectToDB();
    connection.query('SELECT * from users', ((err, result, fields) => {
        if (err) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'text/plain');
            res.end('Error');
        }
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(result));
    }));
    disconnectDB();
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
*/
server.listen(port, hostname, () => {
    connectToDB(connection);
    console.log(`Server running at http://${hostname}:${port}/`);
})
