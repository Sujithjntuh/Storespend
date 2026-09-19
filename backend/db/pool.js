const { Pool } = require("pg");

const pool = new Pool({
    connectionString : process.env.DATABASE_URL,
    ssl : { //secure sockets layer
        rejectUnauthorized : false
    },
});

module.exports = pool;