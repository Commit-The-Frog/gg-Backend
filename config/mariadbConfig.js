// mariadbConfig.js
const mariadb = require('mariadb');
const { MARIADB_HOST, MARIADB_PORT, MARIADB_USER, MARIADB_PASS, MARIADB_DATABASE } = process.env;

const pool = mariadb.createPool({
    host: MARIADB_HOST,
    port: MARIADB_PORT,
    user: MARIADB_USER,
    password: MARIADB_PASS,
    database: MARIADB_DATABASE
});

module.exports = pool;
