const mongoose = require('mongoose')

const Schema = mongoose.Schema

const sessionSchema = new Schema({
    
}, { timestamps: true })

module.exports = mongoose.model('Session', sessionSchema)