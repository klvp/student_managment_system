const jwt = require("jsonwebtoken")
const joi = require("joi")

module.exports.auth = (req, res, next) => {
    try {
        const token = req.header("x-auth-token");
        req.user = jwt.verify(token, process.env.JWT_SECRET_TOKEN);
        next();
    } catch (error) {
        res.send({ error: error });
    }
}

module.exports.errorHandling = (err, req, res, next) => {
    console.error(err.stack)
    return res.status(500).send({
        status: 500,
        error: err.message,
        message: "something went wrong"
    })
}

const studentValidator = joi.object({
    name: joi.string().required().min(3),
    age: joi.number().required().min(1).max(100),
    standard: joi.number().required().min(1).max(20),
    section: joi.string().max(1).valid("A", "B", "C").required(),
    phone: joi.string().length(10).pattern(/^\d{10}$/).required(),
    email: joi.string().email().required()
})

const userValidator = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required().min(8)
})

module.exports.validateStudents = (req, res, next) => {
    const { error } = studentValidator.validate(req.body)
    if (error) return res.status(400).send({
        status: 400,
        message: error.details[0].message
    })
    next()
}

module.exports.validateUser = (req, res, next) => {
    const { error } = userValidator.validate(req.body)
    if (error) return res.status(400).send({
        status: 400,
        message: error.details[0].message
    })
    next()
}