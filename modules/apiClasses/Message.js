let msg = {
    content: `${mainPoopy.config.globalPrefix}${req.body.command}${req.body.args != undefined ? ` ${req.body.args}` : ''}`,

    id: 'apimessage',

    edit: async () => undefined,

    delete: async () => undefined,

    react: async () => undefined,

    fetchReference: async () => undefined,

    fetchWebhook: async () => undefined,

    createReactionCollector: () => {
        return {
            on: () => { },
            once: () => { },
            resetTimer: () => { },
            stop: () => { }
        }
    },

    createMessageComponentCollector: () => {
        return {
            on: () => { },
            once: () => { },
            resetTimer: () => { },
            stop: () => { }
        }
    },

    bot: false,

    attachments: new Map(),

    mentions: {
        users: new Map(),
        members: new Map(),
        roles: new Map()
    }
}

let guild = {
    name: 'Guild',
    fetchAuditLogs: async () => {
        return {
            entries: new Map()
        }
    },
    emojis: {
        cache: new Map()
    },
    ownerID: md5(req.ip),
    id: md5(req.ip).reverse()
}

let channel = {
    isText: () => true,

    sendTyping: async () => undefined,

    fetchWebhooks: async () => new Map([['apichannel', channel]]),

    createWebhook: async () => channel,

    createMessageCollector: () => {
        return {
            on: () => { },
            once: () => { },
            resetTimer: () => { },
            stop: () => { }
        }
    },

    send: async function (payload) {
        if (sent) return

        if (typeof (payload) == 'string') {
            sent = true
            res.type('text').send(payload)
        } else {
            function getAttachment() {
                return (payload.files && payload.files.length > 0 && payload.files[0].attachment) || (payload.embeds && payload.embeds.length > 0 && payload.embeds[0].image && payload.embeds[0].image.url)
            }

            if (getAttachment()) {
                const attachment = getAttachment()

                if (mainPoopy.vars.validUrl.test(attachment)) {
                    sent = true
                    res.redirect(attachment)
                } else {
                    sent = true
                    res.sendFile(`${__dirname}/${attachment}`)
                }
            } else if (payload.embeds && payload.embeds.length > 0) {
                let contents = []

                payload.embeds.forEach(embed => {
                    if (embed.author && embed.author.name) contents.push(embed.author.name)
                    if (embed.title) contents.push(embed.title)
                    if (embed.description) contents.push(embed.description)
                    if (embed.fields && embed.fields.length > 0) contents.push(embed.fields.map(field => `${field.name ?? ''}\n${field.value ?? ''}`).join('\n'))
                    if (embed.footer && embed.footer.text) contents.push(embed.footer.text)
                })

                res.type('text').send(contents.join('\n'))
            } else {
                sent = true
                res.type('text').send(payload.content ?? '')
            }
        }
    },

    owner: mainPoopy.bot.user,

    type: 'GUILD_TEXT',

    id: 'apichannel'
}

let user = {
    send: async () => msg,
    displayAvatarURL: () => mainPoopy.bot.user.displayAvatarURL({ dynamic: true, size: 1024, format: 'png' }),
    createDM: async () => channel,
    username: 'User',
    dmChannel: channel,
    id: md5(req.ip)
}

let member = {
    send: channel.send,
    user: user,
    nickname: 'Member',
    roles: {
        cache: new Map([['apirole', { name: 'owner', id: 'apirole' }]])
    },
    permissions: {
        has: () => true
    },
    id: md5(req.ip)
}

member.guild = guild

channel.guild = guild

guild.members = {
    fetch: async () => member,
    cache: new Map([[md5(req.ip), member]])
}

guild.channels = {
    cache: new Map([['apichannel', channel]])
}

channel.messages = {
    fetch: async () => msg,
    cache: new Map([['apimessage', msg]])
}

msg.author = user
msg.member = member
msg.guild = guild
msg.channel = channel