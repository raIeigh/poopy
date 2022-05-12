const md5 = require('md5')

class Channel {
    constructor(msg) {
        
    }
}

class Guild {
    constructor(msg) {
        this.msg = msg

        this.name = 'Guild'
        this.members = {
            fetch: async () => member,
            cache: new Map([[md5(req.ip), member]])
        }
        this.emojis = {
            cache: new Map()
        }
        this.ownerID = md5(req.ip)
        this.id = 'apiguild'
    }

    get channels() {
        return {
            cache: new Map([['apichannel', new Channel(this.msg)]])
        }
    }

    get members() {
        return {
            fetch: async () => new Member(this.msg),
            cache: new Map([[this.msg.author.id, new Member(this.msg)]])
        }
    }
}

class Message {
    constructor(content, id) {
        this.content = content
        this.id = id

        this.bot = false
        this.guild = guild
        this.channel = channel
        this.member = member
        this.author = author
        this.attachments = new Map()
        this.mentions = {
            users: new Map(),
            members: new Map(),
            roles: new Map()
        }
    }

    get guild() {
        return new Guild(this)
    }

    get channel() {
        return new Channel(this)
    }

    edit = async () => undefined

    delete = async () => undefined

    react = async () => undefined

    fetchReference = async () => undefined

    fetchWebhook = async () => undefined

    createReactionCollector = () => {
        return {
            on: () => { },
            once: () => { },
            resetTimer: () => { },
            stop: () => { }
        }
    }

    createMessageComponentCollector = () => {
        return {
            on: () => { },
            once: () => { },
            resetTimer: () => { },
            stop: () => { }
        }
    }
}

module.exports = Message