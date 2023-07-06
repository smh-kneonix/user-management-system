const mysql = require("mysql");
require("dotenv").config();

const pool = mysql.createPool({
    connectionLimit: 100,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});

function createDB() {
    pool.getConnection((err, connection) => {
        //error handler
        if (err) {
            console.log(err);
            throw err;
        }

        const createUserSQL =
            "CREATE DATABASE IF NOT EXISTS `user-management`;";

        connection.query(createUserSQL, function (err, result) {
            connection.release();
            if (err) {
                return console.log(err);
            }
            console.log(`data base is runing`);
        });
    });
}

function createTable() {
    pool.getConnection((err, connection) => {
        if (err) {
            throw err;
        }
        const createUserSQL =
            "SELECT count(*) FROM information_schema.TABLES WHERE (TABLE_SCHEMA = 'user-management') AND (TABLE_NAME = 'user');";
        connection.query(createUserSQL, async function (err, result) {
            connection.release();
            if (err) throw err;

            if (Object.values(result[0])[0])
                return console.log(`table already exist`);
            createUserTable();
        });
    });

    function createUserTable() {
        pool.getConnection((err, connection) => {
            if (err) throw err;

            const createtableSQL = `CREATE TABLE ${"`user-management`"}.${"`user`"} (
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        email VARCHAR(50) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        comments TEXT NOT NULL,
        status VARCHAR(10) NOT NULL DEFAULT 'active'
    );`;

            connection.query(createtableSQL, function (err) {
                connection.release();
                if (err) throw err;
                console.log("create user table");
            });
        });
    }
}

module.exports = {
    createDB,
    createTable,
};
