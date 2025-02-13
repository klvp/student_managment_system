const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    userType: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        min: 5,
    },
}, { timestamps: true })

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        uppercase: true,
        minLength: 3,
        maxLength: 50,
    },
    age: {
        type: Number,
        required: true,
        min: 1,
        max: 100,
    },
    class: {
        type: Number,
        required: true,
        min: 1,
        max: 10,
    },
    section: {
        type: String,
        enum: ['A', 'B', 'C'],
        default: 'A'
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    phone: {
        type: String,
        required: true,
    },
}, { timestamps: true })

const User = mongoose.model("User", userSchema)
const Student = mongoose.model("Student", studentSchema)

module.exports = {
    User,
    Student
};