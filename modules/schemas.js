var mongoose = require('mongoose')

module.exports = {
    data: mongoose.model('database', mongoose.Schema({
        dataid: {
            type: String,
            required: true
        },

        'bot-data': {
            type: Object,
            required: true
        },

        'user-data': {
            type: Object,
            required: true
        },

        'guild-data': {
            type: Object,
            required: true
        }
    })),

    globaldata: mongoose.model('globaldata', mongoose.Schema({
        'bot-data': {
            type: Object,
            required: true
        }
    }))
}