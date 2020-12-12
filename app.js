const express = require('express');
const http = require('http');
const mysql = require('mysql2');
const path = require('path');

const hostname = '192.168.0.100';
const port = 3000;

const app = express();
app.use('/public', express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages/home/', 'index.html'));
})

//connection config
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'users',
    password: '',
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
const server = http.createServer(app)
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
})
