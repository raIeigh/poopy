const CryptoJS = require('crypto-js')
const Collection = require('@discordjs/collection').Collection

async function createEmbed(url, linkEmbed, poopy) {
    let { validateFile, validateFileFromPath, escapeHTML } = poopy.functions

    var fileinfo

    if (vars.validUrl.test(url)) {
        fileinfo = await validateFile(url, 'very true').catch(() => { })
    } else {
        fileinfo = await validateFileFromPath(url, 'very true').catch(() => { })
    }

    if (!fileinfo) return

    var attachHtml

    switch (fileinfo.type.mime.split('/')[0]) {
        case 'image':
            attachHtml = `<a href="${fileinfo.path}" download="${fileinfo.name}"><img alt="Image" src="${fileinfo.path}"></a>`
            break;

        case 'video':
            attachHtml = `<video controls src="${fileinfo.path} title="${fileinfo.name}""></video>`
            break;

        case 'audio':
            if (!linkEmbed) attachHtml = `<audio controls src="${fileinfo.path}" title="${fileinfo.name}"></audio>`
            break;

        case 'text':
            if (!linkEmbed) attachHtml = escapeHTML(fileinfo.buffer.toString())
            break;

        default:
            if (!linkEmbed) attachHtml = `<a href="${fileinfo.path}" download="${fileinfo.name}">${fileinfo.name}</a>`
            break;
    }

    return attachHtml
}

async function send(payload) {
    let { req, res, poopy, messages } = this
    let { validateFileFromPath, replaceAsync, escapeHTML } = poopy.functions
    let vars = poopy.vars

    if (typeof (payload) == 'string') {
        payload = {
            content: payload
        }
    }

    if (req.body.restype == 'json') {
        if (payload.files && payload.files.length > 0) {
            for (var i in payload.files) {
                var attachment = payload.files[i].attachment

                if (!vars.validUrl.test(attachment)) {
                    var fileinfo = await validateFileFromPath(attachment, 'very true').catch(() => { })

                    if (!fileinfo) continue

                    payload.files[i].attachment = fileinfo.path
                }
            }
        }

        messages.push(payload)

        return new Message(req, res, poopy, payload)
    }

    let message = []

    if (req.body.restype == 'raw') {
        const attachment = (payload.files &&
            payload.files.length > 0 &&
            payload.files.find(file => file.attachment) &&
            payload.files.find(file => file.attachment).attachment)

            ||

            (payload.embeds &&
                payload.embeds.length > 0 &&
                payload.embeds.find(embed => embed.image) &&
                payload.embeds.find(embed => embed.image).image &&
                payload.embeds.find(embed => embed.image).image.url)

        if (attachment) {
            sent = true
            if (vars.validUrl.test(attachment)) {
                res.redirect(attachment)
            } else {
                await new Promise(resolve => res.sendFile(`${__dirname}/${attachment}`, resolve))
            }
        } else {
            if (payload.content) message.push(payload.content)

            if (payload.embeds && payload.embeds.length > 0) {
                let textEmbed = []

                payload.embeds.forEach(embed => {
                    if (embed.author && embed.author.name) textEmbed.push(embed.author.name)
                    if (embed.title) textEmbed.push(embed.title)
                    if (embed.description) textEmbed.push(embed.description)
                    if (embed.fields && embed.fields.length > 0) textEmbed.push(embed.fields.map(field => `${field.name ?? ''}\n${field.value ?? ''}`).join('\n'))
                    if (embed.footer && embed.footer.text) textEmbed.push(embed.footer.text)
                })

                message.push(textEmbed.join('\n'))
            }
        }

        messages.push(message.join('\n'))

        return new Message(req, res, poopy, payload)
    }

    let contents = []
    let container = []

    if (payload.content) contents.push(escapeHTML(payload.content))

    if (payload.embeds && payload.embeds.length > 0) {
        let textEmbed = []

        for (var i in payload.embeds) {
            const embed = payload.embeds[i]

            if (embed.author && embed.author.name) textEmbed.push(escapeHTML(embed.author.name))
            if (embed.title) textEmbed.push(escapeHTML(embed.title))
            if (embed.description) textEmbed.push(escapeHTML(embed.description))
            if (embed.fields && embed.fields.length > 0) textEmbed.push(embed.fields.map(field => escapeHTML(`${field.name ?? ''}\n${field.value ?? ''}`)).join('\n'))
            if (embed.footer && embed.footer.text) textEmbed.push(escapeHTML(embed.footer.text))
            if (embed.thumbnail && embed.thumbnail.url) container.push(await createEmbed(embed.thumbnail.url))
            if (embed.image && embed.image.url) container.push(await createEmbed(embed.image.url))
        }

        contents.push(textEmbed.join('\n'))
    }

    if (payload.files && payload.files.length > 0) {
        for (var i in payload.files) {
            const attachment = payload.files[i].attachment
            const attachEmbed = await createEmbed(attachment)
            if (attachEmbed) container.push(attachEmbed)
        }
    }

    for (var i in contents) {
        var valid = 0
        contents[i] = await replaceAsync(contents[i], new RegExp(vars.validUrl, 'g'), async (url) => {
            if (valid < 10) {
                const attachEmbed = await createEmbed(url, true)
                if (attachEmbed) {
                    container.push(attachEmbed)
                    valid++
                }
            }

            return `<a href="${url}" target="_blank">${url}</a>`
        })
    }

    if (contents.length > 0) message.push(`<div class="contents">${contents.join('')}</div>`)
    if (container.length > 0) message.push(`<div class="container">${container.join('')}</div>`)
    message = `<div class="message">${message.join('')}</div>`

    messages.push(message)

    return new Message(req, res, poopy, messages, payload)
}

class Guild {
    constructor(req, res, poopy, messages) {
        let bot = poopy.bot

        this._req = req
        this._res = res
        this._poopy = poopy
        this._messages = messages

        this.name = `${bot.user.username}'s API`
        this.emojis = {
            cache: new Collection()
        }
        this.ownerId = bot.user.id
        this.id = 'API'
    }

    get channels() {
        let channel = new Channel(this._req, this._res, this._poopy, this._messages)
        return {
            cache: new Collection([[channel.id, channel]])
        }
    }

    get members() {
        let member = new GuildMember(this._req, this._res, this._poopy, this._messages)
        return {
            fetch: async (id) => id == member.id && member,
            cache: new Collection([[member.id, member]])
        }
    }

    async fetchAuditLogs() {
        return {
            entries: new Collection()
        }
    }
}

class Channel {
    constructor(req, res, poopy, messages) {
        let bot = poopy.bot

        this._req = req
        this._res = res
        this._poopy = poopy
        this._messages = messages

        this.owner = bot.user
        this.nsfw = false
        this.type = 0
        this.name = 'Channel'
        this.id = Array.from(CryptoJS.MD5(req.ip).toString()).reverse().join('')
    }

    get messages() {
        let message = new Message(this._req, this._res, this._poopy, this._messages)
        return {
            fetch: async (id) => id == message.id && message,
            cache: new Collection([[message.id, message]])
        }
    }

    get guild() {
        return new Guild(this._req, this._res, this._poopy, this._messages)
    }

    async send(payload) {
        return send.call({
            req: this._req,
            res: this._res,
            poopy: this._poopy,
            messages: this._messages
        }, payload)
    }

    permissionsFor() {
        return {
            has: () => true
        }
    }

    async sendTyping() { }

    async fetchWebhook() {
        return new Collection([[this.id, this]])
    }

    async createWebhook() {
        return this
    }

    createMessageCollector() {
        return {
            on: () => { },
            once: () => { },
            resetTimer: () => { },
            stop: () => { }
        }
    }
}

class GuildMember {
    constructor(req, res, poopy, messages) {
        this._req = req
        this._res = res
        this._poopy = poopy
        this._messages = messages

        this.nickname = 'Member'
        this.roles = {
            cache: new Collection([['Role', { name: 'Owner', id: 'Role' }]])
        }
        this.permissions = {
            has: () => true
        }
        this.id = CryptoJS.MD5(req.ip).toString()
    }

    get user() {
        return new User(this._req, this._res, this._poopy, this._messages)
    }

    async send(payload) {
        return send.call({
            req: this._req,
            res: this._res,
            poopy: this._poopy,
            messages: this._messages
        }, payload)
    }
}

class User {
    constructor(req, res, poopy, messages) {
        this._req = req
        this._res = res
        this._poopy = poopy
        this._messages = messages

        this.username = 'User'
        this.tag = 'User'
        this.id = CryptoJS.MD5(req.ip).toString()
    }

    get channel() {
        return new Channel(this._req, this._res, this._poopy, this._messages)
    }

    get dmChannel() {
        return new Channel(this._req, this._res, this._poopy, this._messages)
    }

    async send(payload) {
        return send.call({
            req: this._req,
            res: this._res,
            poopy: this._poopy,
            messages: this._messages
        }, payload)
    }

    displayAvatarURL() {
        return 'https://cdn.discordapp.com/embed/avatars/0.png'
    }

    async createDM() {
        return new Channel()
    }
}

class Message {
    constructor(req, res, poopy, messages, payload) {
        let { generateId } = poopy.functions
        let config = poopy.config

        if (payload) {
            if (typeof payload == 'string') payload = { content: payload }

            payload.content = payload.content ?? ''
            payload.embeds = payload.embeds ?? []
            payload.attachments = new Collection((payload.files ?? []).map(a => [`Attachment${i++}`, {
                id: `Attachment${i++}`,
                name: a.name,
                url: a.url
            }]))
            payload.stickers = payload.stickers ?? []
        }

        this._req = req
        this._res = res
        this._poopy = poopy
        this._messages = messages

        this.content = payload ? payload.content : `${config.globalPrefix}${req.body.args}`
        this.attachments = payload ? payload.attachments : new Collection()
        this.embeds = payload ? payload.embeds : []
        this.stickers = payload ? payload.stickers : new Collection()

        this.id = generateId()
        this.type = 0
        this.bot = false
        this.mentions = {
            users: new Collection(),
            members: new Collection(),
            roles: new Collection()
        }
    }

    get author() {
        return new User(this._req, this._res, this._poopy, this._messages)
    }

    get member() {
        return new GuildMember(this._req, this._res, this._poopy, this._messages)
    }

    get channel() {
        return new Channel(this._req, this._res, this._poopy, this._messages)
    }

    get guild() {
        return new Guild(this._req, this._res, this._poopy, this._messages)
    }

    async reply(payload) {
        return send.call({
            req: this._req,
            res: this._res,
            poopy: this._poopy,
            messages: this._messages
        }, payload)
    }

    async edit(payload) {
        return send.call({
            req: this._req,
            res: this._res,
            poopy: this._poopy,
            messages: this._messages
        }, payload)
    }

    async delete() { }

    async react() { }

    async fetchReference() { }

    async fetchWebhook() { }

    createReactionCollector() {
        return {
            on: () => { },
            once: () => { },
            resetTimer: () => { },
            stop: () => { }
        }
    }

    createMessageComponentCollector() {
        return {
            on: () => { },
            once: () => { },
            resetTimer: () => { },
            stop: () => { }
        }
    }
}

module.exports = Message