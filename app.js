const express = require('express');
const http = require('http');
const mysql = require('mysql2');
const path = require('path');
const socket = require('socket.io');

const hostname = '192.168.0.100';
const port = 3000;

let usersCountOnline = 0;

//configure connection to DB
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'users',
    password: '',
})

const app = express();

const server = http.createServer(app);
const io = socket(server);

//configure public folder
app.use('/public', express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages/home/', 'index.html'));
})

io.on('connection', (socket) => {

    console.log('user connected');
    io.emit('Users count', ++usersCountOnline);

    socket.on('chat', ({user, text}) => {
        const str = text.trim();
        if (str) {
            io.emit('chat', `${user}: ${text}`);
        }
    })
    socket.on('disconnect', () => {
        console.log('user disconnected');
        io.emit('Users count', --usersCountOnline);
    });
})

function connectToDB() {
    connection.connect(function(err){
        if (err) {
            return console.error("Ошибка: " + err.message);
        }
        else{
            console.log("Подключение к серверу MySQL успешно установлено");
        }
    });
}

function disconnectDB() {
    console.log('MySQL: Disconnecting');
    connection.end();
}

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
    console.log(`Server running at http://${hostname}:${port}/`);
})
