const mongoose = require('mongoose')

mongoose.Promise = global.Promise

const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    roles: [String]
})

const User = mongoose.model('user', UserSchema)

module.exports = User