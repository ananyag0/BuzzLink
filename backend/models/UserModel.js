const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema({
    displayName: {
        type: String, 
        required: true
    }, 
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, { timestamps: true }, {collection: "Users"})

module.exports = mongoose.model('User', userSchema)