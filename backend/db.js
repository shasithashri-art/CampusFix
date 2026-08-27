const { Pool } = require("pg");

const pool = new Pool({
    user: "postgres",       // your pgAdmin username (default is usually "postgres")
    host: "localhost",
    database: "campusfix",
    password: "Sshri3S",  // the password you set for pgAdmin/PostgreSQL
    port: 5432,              // default PostgreSQL port
});

module.exports = pool;