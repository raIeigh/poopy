var mongoose = require('mongoose')

module.exports = {
    botData: mongoose.model('botData', mongoose.Schema({
        dataid: {
            type: String,
            required: true
        },

        messages: {
            type: Number,
            required: false
        },

        commands: {
            type: Number,
            required: false
        },

        filecount: {
            type: Number,
            required: false
        },

        reboots: {
            type: Number,
            required: false
        }
    })),

    userData: mongoose.model('userData', mongoose.Schema({
        dataid: {
            type: String,
            required: true
        },

        uid: {
            type: String,
            required: true
        },

        username: {
            type: String,
            required: false
        },

        health: {
            type: Number,
            required: false
        },

        defense: {
            type: Number,
            required: false
        },

        attack: {
            type: Number,
            required: false
        },

        accuracy: {
            type: Number,
            required: false
        },

        level: {
            type: Number,
            required: false
        },

        bucks: {
            type: Number,
            required: false
        },

        dms: {
            type: Boolean,
            required: false
        },

        tokens: {
            type: Object,
            required: false
        }
    })),

    guildData: mongoose.model('guildData', mongoose.Schema({
        dataid: {
            type: String,
            required: true
        },

        gid: {
            type: String,
            required: true
        },


        chaincommands: {
            type: Boolean,
            required: false
        },

        prefix: {
            type: String,
            required: false
        },

        messages: {
            type: Array,
            required: false
        },

        disabled: {
            type: Array,
            required: false
        },

        localcmds: {
            type: Array,
            required: false
        },

        joins: {
            type: Number,
            required: false
        },

        read: {
            type: Boolean,
            required: false
        },

        lastuse: {
            type: Number,
            required: false
        },

        keyexec: {
            type: Number,
            required: false
        }
    })),

    channelData: mongoose.model('channelData', mongoose.Schema({
        dataid: {
            type: String,
            required: true
        },

        cid: {
            type: String,
            required: true
        },

        gid: {
            type: String,
            required: true
        },

        read: {
            type: Boolean,
            required: false
        },

        nsfw: {
            type: Boolean,
            required: false
        },

        lastUrls: {
            type: Array,
            required: false
        }
    })),

    memberData: mongoose.model('memberData', mongoose.Schema({
        dataid: {
            type: String,
            required: true
        },

        uid: {
            type: String,
            required: true
        },

        gid: {
            type: String,
            required: true
        },

        username: {
            type: String,
            required: false
        },

        coolDown: {
            type: Number,
            required: false
        },

        messages: {
            type: Number,
            required: false
        },

        lastmessage: {
            type: Number,
            required: false
        }
    })),

    globalData: mongoose.model('globalData', mongoose.Schema({
        commandTemplates: {
            type: Array,
            required: false
        },

        shit: {
            type: Array,
            required: false
        },
        
        psfiles: {
            type: Array,
            required: false
        },
        
        pspasta: {
            type: Array,
            required: false
        },
        
        funnygif: {
            type: Array,
            required: false
        },
        
        poop: {
            type: Array,
            required: false
        },
        
        dmphrases: {
            type: Array,
            required: false
        }
    })),

    data: mongoose.model('database', mongoose.Schema({
        dataid: {
            type: String,
            required: true
        },

        botData: {
            type: Object,
            required: false
        },

        userData: {
            type: Object,
            required: false
        },

        guildData: {
            type: Object,
            required: false
        }
    })),
}