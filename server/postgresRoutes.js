
// const { auth } = require("./middleware.js")
const router = require("express").Router()
const { validateStudents, validateUser } = require("./middleware")
const postgresController = require("./postgresController")
// user endpoints
router.post("/register", validateUser, postgresController.userRegisteration)
router.post("/login", postgresController.userLogin)


// students CRUD endpoints
// router.use(auth)
router.post("/students", validateStudents, postgresController.addStudent)
router.get("/students", postgresController.getStudents)
router.get("/students/:studentId", postgresController.getStudentById)
router.put("/students/:studentId", validateStudents, postgresController.updateStudentById)
router.delete("/students/:studentId", postgresController.deleteStudentById)

module.exports = router