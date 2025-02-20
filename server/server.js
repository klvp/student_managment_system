const express = require("express")
const cors = require("cors")
require("dotenv").config()
const ApiRoutes = require("./routes.js")
const postgresRoutes = require("./postgresRoutes.js")
const pool = require("./db.postgres.connection.js")
const { errorHandling } = require("./middleware.js")
const { createUserTable, createStudentTable } = require("./data/createTables.js")

const app = express()
app.use(express.json())
app.use(cors({
    origin: ["http://localhost:5173", "https://student-management-klvp.netlify.app"], // Frontend origin
    credentials: true, // Allow credentials (cookies, etc.)
}))

let PORT = process.env.PORT || 5000
// require("./db.connection.js")
createStudentTable()
createUserTable()

app.get("/", async (req, res) => {
    const result = await pool.query("SELECT current_database()")
    return res.status(200).send(`Hello I am node express server 🚀 ${result.rows[0].current_database}`)
})

app.get("/healthcheck", async (req, res) => {
    try {
        let health = {
            uptime: process.uptime(),
            cpu: process.cpuUsage(),
            memory: process.memoryUsage()
        }
        return res.status(200).send({ status: true, message: 'health of the node server', data: health })
    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: false, message: 'something happended on server' })
    }
})

app.use("/api/postgres", postgresRoutes)
// app.use("/api", ApiRoutes)

// Error Handling
app.use(errorHandling)


app.listen(PORT, () => console.log(`server started on port ${PORT}`))