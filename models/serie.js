const mongoose = require('mongoose')

mongoose.Promise = global.Promise

const commentSchema = mongoose.Schema({
    comment: String
})
const SerieSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enumValues: ['to-watch', 'watching', 'watched']
    },
    comments: [commentSchema]
})

const Serie = mongoose.model('Serie', SerieSchema)

module.exports = Serie