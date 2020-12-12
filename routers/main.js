const {Router} = require('express');
const path = require('path');
const { connection } = require('../tool/database');

const router = Router();

router.get('/getposts', (req, res) => {
    connection.query('select * from users;', (err, result) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(result));
    });
})

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../', 'pages/home/', 'index.html'));
})

module.exports = router;