const { Pool } = require("pg")

const pool = new Pool({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PWD,
    database: process.env.POSTGRES_DB,
})

pool.on("connect", () => console.log("Connection to POOL established"))

module.exports = pool