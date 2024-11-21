const mysql     = require("mysql2")
const config    = require("./config")

const db = mysql.createConnection({
    host: config.HOST,
    user: config.USER,
    password: config.PASSWORD,
    database: config.DATABASE,
    port: config.DBPORT
})

db.connect((err) => {
    if(err) {
        throw err
    }
    console.log("Connected to MySQL database.")
})

module.exports = db