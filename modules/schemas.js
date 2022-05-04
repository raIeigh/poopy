var mongoose = require('mongoose')
const Any = mongoose.SchemaTypes.Mixed

module.exports = {
    data: mongoose.model('database', mongoose.Schema({
        dataid: {
            type: String,
            required: true
        },

        'bot-data': {
            type: Any,
            required: false
        },

        'user-data': {
            type: Any,
            required: false
        },

        'guild-data': {
            type: Any,
            required: false
        }
    })),

    globaldata: mongoose.model('globaldata', mongoose.Schema({
        'bot-data': {
            type: Any,
            required: false
        }
    }))
}