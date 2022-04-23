var mongoose = require('mongoose')
const Any = mongoose.SchemaTypes.Mixed

module.exports = mongoose.model('database', mongoose.Schema({
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
}))