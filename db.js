const mysql = require("mysql")

const db = mysql.createConnection({
    host: "db4free.net",
    user: "manilox",
    password: "$#7CZpR@W_aTN2*"
})
// const db = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "123456"
// })


module.exports = db