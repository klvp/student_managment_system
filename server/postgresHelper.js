const pool = require("./db.postgres.connection")
const { genHashPassword } = require("./helper")

module.exports.createStudent = async ({ name, age, email, standard, section, phone }) => {
    const result = await pool.query(
        "INSERT INTO students(name, age, email, class, section, phone) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *",
        [name, age, email, standard, section, phone]
    )

    return result.rows[0]
}

module.exports.updateStudent = async (id, { name, age, email, class: standard, section, phone }) => {
    const result = await pool.query(
        "UPDATE students SET name = $1, age = $2, email = $3, class = $4, section = $5, phone= $6 WHERE id = $7 RETURNING *",
        [name, age, email, standard, section, phone, id]
    )

    return result.rows[0]
}

module.exports.deleteStudent = async (id) => {
    const result = await pool.query(
        "DELETE FROM students WHERE id = $1 RETURNING *",
        [id]
    )

    return result.rows[0]
}

module.exports.getStudents = async () => {
    const result = await pool.query(
        "SELECT * FROM students"
    )

    return result.rows
}

module.exports.getStudentById = async (id) => {
    const result = await pool.query(
        "SELECT * FROM students WHERE id = $1",
        [id]
    )

    return result.rows[0]
}

module.exports.createUser = async ({ email, password }) => {
    const hashedPassword = await genHashPassword(password)

    const result = await pool.query(
        "INSERT INTO users( email, password) VALUES($1,$2) RETURNING *",
        [email, hashedPassword]
    )

    return result.rows[0]
}

module.exports.getUserByEmail = async (email) => {
    const result = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
    )

    return result.rows[0]
}