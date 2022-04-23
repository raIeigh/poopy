var mongoose = require('mongoose')
const Any = mongoose.SchemaTypes.Mixed

module.exports = {
    'bot-data': mongoose.model('bot-data', mongoose.Schema({
        dataid: {
            type: String,
            required: true
        },

        messages: {
            type: Any,
            required: false
        },

        commands: {
            type: Any,
            required: false
        },

        filecount: {
            type: Any,
            required: false
        },

        reboots: {
            type: Any,
            required: false
        },
    })),

    'user-data': mongoose.model('user-data', mongoose.Schema({
        dataid: {
            type: String,
            required: true
        },

        username: {
            type: Any,
            required: false
        },

        health: {
            type: Any,
            required: false
        },

        lastFartRate: {
            type: Any,
            required: false
        },

        fartRate: {
            type: Any,
            required: false
        },

        dms: {
            type: Any,
            required: false
        }
    })),
    
    'guild-data': mongoose.model('guild-data', mongoose.Schema({
        dataid: {
            type: String,
            required: true
        },

        chaincommands: {
            type: Any,
            required: false
        },

        prefix: {
            type: Any,
            required: false
        },

        channels: {
            type: Any,
            required: false
        },

        members: {
            type: Any,
            required: false
        },

        messages: {
            type: Any,
            required: false
        },

        gettingData: {
            type: Any,
            required: false
        },

        disabled: {
            type: Any,
            required: false
        },

        localcmds: {
            type: Any,
            required: false
        },

        joins: {
            type: Any,
            required: false
        }
    }))
}
