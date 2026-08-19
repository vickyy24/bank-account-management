const mysql = require("mysql2");
const env = require("dotenv");

env.config();

const con = mysql.createConnection({

    host: process.env.DB_HOST,

    user: process.env.DB_USER,

    password: process.env.DB_PASSWORD,

    database: process.env.DB_NAME,

});

con.connect(function(error){

    if(error){

        console.log(error);

    }
    else{

        console.log("Database Connected");

    }

});

module.exports = con.promise();