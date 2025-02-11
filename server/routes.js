const {
    userRegisteration,
    userLogin,
    addStudent,
    getStudents,
    getStudentById,
    updateStudentById,
    deleteStudentById
} = require("./controller.js")
const { auth } = require("./middleware.js")
const router = require("express").Router()

// user endpoints
router.post("/register", userRegisteration)
router.post("/login", userLogin)


// students CRUD endpoints
router.use(auth)
router.post("/students", addStudent)
router.get("/students", getStudents)
router.get("/students/:studentId", getStudentById)
router.put("/students/:studentId", updateStudentById)
router.delete("/students/:studentId", deleteStudentById)

module.exports = router