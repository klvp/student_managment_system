const pool = require("../db.postgres.connection")

module.exports.createStudentTable = async () => {
    const queryText = `
        CREATE TABLE IF NOT EXISTS students (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            age INT CHECK (age BETWEEN 1 AND 100),
            class INT CHECK (class BETWEEN 1 AND 20),
            section CHAR(1) CHECK (section IN ('A', 'B', 'C')),
            email VARCHAR(100) UNIQUE NOT NULL,
            phone CHAR(10) CHECK (phone ~ '^[0-9]{10}$'),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `
    try {
        await pool.query(queryText)
        console.log("Student Table Created Successfully if not exist")
    } catch (error) {
        console.log("Error while creating student table: ", error)
    }
}

module.exports.createUserTable = async () => {
    const queryText = `
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            email VARCHAR(100) UNIQUE NOT NULL,
            password TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `
    try {
        await pool.query(queryText)
        console.log("Users Table Created Successfully if not exist")
    } catch (error) {
        console.log("Error while creating user table: ", error)
    }
}