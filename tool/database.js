const mysql = require('mysql2');

function connectToDB(connection) {
    connection.connect(function(err){
        if (err) {
            return console.error("Ошибка: " + err.message);
        }
        else{
            console.log("Подключение к серверу MySQL успешно установлено");
        }
    });
}

function disconnectDB(connection) {
    console.log('MySQL: Disconnecting');
    connection.end();
}

//configure connection to DB
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'users',
    password: '',
})

module.exports = {connectToDB, disconnectDB, connection};