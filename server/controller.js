const jwt = require("jsonwebtoken")
const { User, Student } = require("./models.js")
const { genHashPassword, isPasswordCorrect } = require("./helper.js")

module.exports.userRegisteration = async (req, res) => {
    try {
        const { body: { email, password } } = req
        let user = await User.findOne({ email })
        if (user) {
            return res.status(403).send({ status: false, message: "User already exist" })
        }
        const newUser = new User({
            email,
            password: await genHashPassword(password)
        })
        const result = await newUser.save()
        return res.status(200).send({ message: "user registered", data: result._id })

    } catch (error) {
        console.log("🚀 ~ module.exports.userRegisteration= ~ error:", error)
        return res.status(500).send({ message: "something happened", error })
    }
}

module.exports.userLogin = async (req, res) => {
    try {
        const { body: { email, password } } = req
        let user = await User.findOne({ email })
        if (!user) {
            return res.status(404).send({ status: false, message: "invalid password or email" })
        }
        if (! await isPasswordCorrect(password, user.password)) {
            return res.status(400).send({ status: false, message: "invalid password or email" })
        }
        const token = jwt.sign(
            {
                id: user._id,
                email: user.email
            },
            process.env.JWT_SECRET_TOKEN
        )
        res.cookie("token", token, {
            expires: new Date(Date.now() + 3000000),
        })
        return res.status(200).send({
            token,
            data: {
                id: user._id,
                email,
                userType: user.userType
            }
        })

    } catch (error) {
        console.log("🚀 ~ module.exports.userLogin= ~ error:", error)
        return res.status(500).send({ message: "something happened", error })
    }
}

module.exports.addStudent = async (req, res) => {
    try {
        const { body: { name, age, section, email, standard, phone } = {} } = req
        let student = await Student.findOne({ name, email, class: standard, section })
        if (student) {
            return res.status(403).send({ status: false, message: "User already exist" })
        }
        const newUser = new Student({
            name,
            age,
            class: standard,
            section,
            email,
            phone
        })
        const result = await newUser.save()
        return res.status(200).send({ message: "student added", data: result._id })
    } catch (error) {
        console.log("🚀 ~ module.exports.addStudent= ~ error:", error)
        return res.status(500).send({ message: "something happened", error })
    }

}

module.exports.getStudents = async (req, res) => {
    try {
        const { query: { search = null } = {} } = req
        let filter = search ? (isNaN(search) ? { name: { $regex: search, $options: 'i' } } : { class: parseInt(search) }) : {}
        let allStudents = await Student.find({
            ...filter
        }).sort({ class: 1, name: 1 })
        if (!allStudents.length) {
            return res.status(404).send({ status: "success", data: [] })
        }
        return res.status(200).send({ status: "success", data: allStudents })

    } catch (error) {
        console.log("🚀 ~ module.exports.getStudents= ~ error:", error)
        return res.status(500).send({ message: "something happened", error })
    }
}

module.exports.getStudentById = async (req, res) => {
    try {
        const { params: { studentId } = {} } = req
        let studentDetails = await Student.findById(studentId)
        if (!studentDetails) {
            return res.status(404).send({ status: "success", data: {}, message: "student not found" })
        }
        return res.status(200).send({ status: "success", data: studentDetails })

    } catch (error) {
        console.log("🚀 ~ module.exports.getStudentById= ~ error:", error)
        return res.status(500).send({ message: "something happened", error })
    }
}

module.exports.updateStudentById = async (req, res) => {
    try {
        const {
            params: { studentId },
            body: { name, age, section, email, standard, phone }
        } = req
        let studentDetails = await Student.findById(studentId)
        if (!studentDetails) {
            return res.status(404).send({ status: "success", data: {}, message: "student not found" })
        }
        await Student.findByIdAndUpdate(
            studentId,
            {
                $set: { name, age, section, email, class: standard, phone }
            }
        )
        return res.status(200).send({ status: "success", message: "student updated" })
    } catch (error) {
        console.log("🚀 ~ module.exports.updateStudentById= ~ error:", error)
        return res.status(500).send({ message: "something happened", error })
    }
}

module.exports.deleteStudentById = async (req, res) => {
    try {
        const { params: { studentId } = {} } = req
        let student = await Student.findById(studentId)
        if (!student) {
            return res.status(404).send({ status: false, message: "User not found" })
        }
        await Student.deleteOne({ _id: studentId })
        return res.status(200).send({ message: "student deleted" })
    } catch (error) {
        console.log("🚀 ~ module.exports.deleteStudentById ~ error:", error)
        return res.status(500).send({ message: "something happened", error })
    }
}
