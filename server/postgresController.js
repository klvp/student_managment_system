// standard response function
const { isPasswordCorrect } = require("./helper")
const jwt = require("jsonwebtoken")
const postgresHelper = require("./postgresHelper")

const handleResponse = (res, status, message, data = null) => {
    res.status(status).send({
        status,
        message,
        data
    })
}

module.exports.userRegisteration = async (req, res, next) => {
    try {
        const { body: { email, password } } = req
        let userExist = await postgresHelper.getUserByEmail(email)
        if (userExist) return handleResponse(res, 403, "User Already Exist")
        let createdUser = await postgresHelper.createUser({ email, password })
        return handleResponse(res, 201, "User created", createdUser)
    } catch (error) {
        next(error)
    }
}

module.exports.userLogin = async (req, res, next) => {
    try {
        const { body: { email, password } } = req
        let userExist = await postgresHelper.getUserByEmail(email)
        if (!userExist) return handleResponse(res, 404, "User Not Found")

        if (! await isPasswordCorrect(password, userExist.password)) {
            return handleResponse(res, 401, "invalid password or email")
        }
        const token = jwt.sign(
            {
                id: userExist.id,
                email: userExist.email
            },
            process.env.JWT_SECRET_TOKEN
        )
        res.cookie("token", token, {
            expires: new Date(Date.now() + 3000000),
        })
        return handleResponse(res, 200, "User Authenticated", { id: userExist.id, email: userExist.email, token })

    } catch (error) {
        next(error)
    }
}

// #region student request handlers
module.exports.addStudent = async (req, res, next) => {
    try {
        const { body: { name, age, section, email, standard, phone } = {} } = req
        const newStudent = await postgresHelper.createStudent({ name, age, section, email, standard, phone })
        return handleResponse(res, 201, "Student created successfully", newStudent)
    } catch (error) {
        next(error)
    }
}

module.exports.getStudents = async (req, res, next) => {
    try {
        const students = await postgresHelper.getStudents()
        if (!students.length) return handleResponse(res, 404, "Students not found", [])
        return handleResponse(res, 200, "Students fetched successfully", students)
    } catch (error) {
        next(error)
    }
}

module.exports.getStudentById = async (req, res, next) => {
    try {
        const { params: { studentId } = {} } = req
        let student = await postgresHelper.getStudentById(studentId)
        if (!student) return handleResponse(res, 404, "Student not found")
        return handleResponse(res, 200, "Student fetched successfully", student)
    } catch (error) {
        next(error)
    }
}

module.exports.updateStudentById = async (req, res, next) => {
    try {
        const {
            params: { studentId },
        } = req

        let student = await postgresHelper.getStudentById(studentId)
        if (!student) return handleResponse(res, 404, "Student not found")
        let updatedStudent = await postgresHelper.updateStudent(studentId, { ...student, ...req.body })
        return handleResponse(res, 200, "Student Updated", updatedStudent)
    } catch (error) {
        next(error)
    }
}

module.exports.deleteStudentById = async (req, res, next) => {
    try {
        const { params: { studentId } = {} } = req
        let deletedUser = await postgresHelper.deleteStudent(studentId)
        if (!deletedUser) return handleResponse(res, 404, "Student not found")
        return handleResponse(res, 200, "Student deleted", deletedUser)
    } catch (error) {
        next(error)
    }
}
// #endregion