const mariadb = require('mariadb');

const db = {
    pool: mariadb.createPool({
        host: '127.0.0.1',
        port: 3306,
        database: 'edent',
        user:'root', 
        password: '',
        connectionLimit: 5
    })
}

module.exports = db;