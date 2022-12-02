const mysql = require('mysql');

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "123456789",
    database: "Module3_Exam",
    port: 3306,
    charset: 'utf8_general_ci'
})

module.exports = connection;
