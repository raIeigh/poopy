const throng = require('throng')

async function start() {
    let poopyStarted = false
    let mainPoopy
    let { sleep, escapeHTML } = require('./src/functions')

    if (process.env.BOT_WEBSITE) {
        const express = require('express')
        const cors = require('cors')
        const bp = require('body-parser')
        const axios = require('axios')
        const CryptoJS = require('crypto-js')
        const Collection = require('@discordjs/collection').Collection

        const PORT = process.env.PORT || 8080
        const app = express()

        app.use(cors())
        app.use(bp.json())
        app.use(bp.urlencoded({ extended: true }))
        app.use(function (req, res, next) {
            const isNotSecure = (!req.get('x-forwarded-port') && req.protocol !== 'https') ||
                parseInt(req.get('x-forwarded-port'), 10) !== 443 &&
                (parseInt(req.get('x-forwarded-port'), 10) === parseInt(req.get('x-forwarded-port'), 10))

            if (isNotSecure && !req.hostname.includes('localhost')) {
                return res.redirect(301, `https://${req.get('host')}${req.url}`)
            }

            next()
        })

        app.get('/api/waitPoopyStart', async function (_, res) {
            while (!poopyStarted) await sleep(1000)
            res.end()
        })

        app.get('/api/psfiles', async function (req, res) {
            if (req.query.nowait && !poopyStarted) {
                res.end()
                return
            }

            while (!poopyStarted) await sleep(1000)
            res.type('json').send(mainPoopy.globaldata['psfiles'])
        })

        app.get('/api/pspasta', async function (req, res) {
            if (req.query.nowait && !poopyStarted) {
                res.end()
                return
            }

            while (!poopyStarted) await sleep(1000)
            res.type('json').send(mainPoopy.globaldata['pspasta'])
        })

        app.get('/ubervoices', async function (_, res) {
            while (!poopyStarted) await sleep(1000)
            let vars = mainPoopy.vars
            var listings = [[], [], []]
            var li = 0

            for (var i in vars.ubercategories) {
                var category = vars.ubercategories[i]
                listings[li % listings.length].push(category)
                li++
            }

            res.type('html').send(`<!DOCTYPE html><html><head><title>uberduck voices</title><link rel="icon" href="https://uberduck.ai/favicon.ico"><meta property="og:image" content="https://uberduck.ai/uberduck-circle.png"><meta property="og:title" content="uberudcucking"><meta property="og:description" content="make sure to copy the name after the &quot;--->&quot; arrow"></head><body style="font-family: monospace; display: grid; grid-template-columns: ${listings.map(() => 'auto').join(' ')};">${listings.map(listing => `<div>${listing.map(category => `<div style="background-color: #efefef; border: 1px solid #ccc; border-radius: 10px; padding: 10px; margin: 10px 5px;"><h2 style="margin: 0;">${escapeHTML(category.name)}</h2><br>${category.voices.map(vc => `${escapeHTML(vc.display_name)} ---&gt; <b>${escapeHTML(vc.name)}</b>`).join('<br>')}</div>`).join('')}</div>`).join('')}</body></html>`)
        })

        app.post('/api/command', async function (req, res) {
            while (!poopyStarted) await sleep(1000)

            let config = mainPoopy.config
            let { validateFile, validateFileFromPath,
                replaceAsync } = mainPoopy.functions
            let vars = mainPoopy.vars
            let callbacks = mainPoopy.callbacks
            let bot = mainPoopy.bot

            var restype = req.body.restype ?? 'html'

            req.body = req.body ?? {}

            let messages = []

            // mockup message
            let msg = {
                content: `${config.globalPrefix}${req.body.args}`,

                id: 'apimessage',

                delete: async () => { },

                react: async () => { },

                fetchReference: async () => { },

                fetchWebhook: async () => { },

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

                attachments: new Collection(),

                embeds: [],

                stickers: new Collection(),

                mentions: {
                    users: new Collection(),
                    members: new Collection(),
                    roles: new Collection()
                }
            }

            let guild = {
                name: 'Guild',
                fetchAuditLogs: async () => {
                    return {
                        entries: new Collection()
                    }
                },
                emojis: {
                    cache: new Collection()
                },
                ownerID: CryptoJS.MD5(req.ip).toString(),
                id: CryptoJS.MD5(req.ip).toString().split('').reverse().join('')
            }

            let channel = {
                isText: () => true,

                sendTyping: async () => { },

                fetchWebhooks: async () => new Collection([['apichannel', channel]]),

                createWebhook: async () => channel,

                createMessageCollector: () => {
                    return {
                        on: () => { },
                        once: () => { },
                        resetTimer: () => { },
                        stop: () => { }
                    }
                },

                owner: bot.user,

                nsfw: false,

                type: 'GUILD_TEXT',

                name: 'Channel',

                id: 'apichannel'
            }

            let user = {
                send: async () => msg,
                displayAvatarURL: () => 'https://cdn.discordapp.com/embed/avatars/0.png',
                createDM: async () => channel,
                username: 'User',
                tag: 'User',
                dmChannel: channel,
                id: CryptoJS.MD5(req.ip).toString()
            }

            let member = {
                send: channel.send,
                user: user,
                nickname: 'Member',
                roles: {
                    cache: new Collection([['apirole', { name: 'owner', id: 'apirole' }]])
                },
                permissions: {
                    has: () => true
                },
                id: CryptoJS.MD5(req.ip).toString()
            }

            function newMessage(payload) {
                var newMsg = { ...msg }

                if (typeof payload == 'string') payload = { content: payload }
                newMsg.content = payload.content ?? ''
                newMsg.embeds = payload.embeds ?? []

                var attachments = payload.files ?? []
                var i = 0
                newMsg.attachments = new Collection(attachments.map(attachment => [`apiattachment${i++}`, {
                    id: `apiattachment${i++}`,
                    name: attachment.name,
                    url: attachment.url
                }]))

                return newMsg
            }

            async function createEmbed(url, linkEmbed) {
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

            const send = async function (payload) {
                if (typeof (payload) == 'string') {
                    payload = {
                        content: payload
                    }
                }

                if (restype == 'json') {
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

                    return newMessage(payload)
                }

                let message = []

                if (restype == 'raw') {
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

                    return newMessage(payload)
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

                return newMessage(payload)
            }

            channel.send = send
            msg.edit = send
            msg.reply = send

            member.guild = guild
            channel.guild = guild

            guild.members = {
                fetch: async () => member,
                cache: new Collection([[CryptoJS.MD5(req.ip).toString(), member]])
            }

            guild.channels = {
                cache: new Collection([['apichannel', channel]])
            }

            channel.messages = {
                fetch: async () => msg,
                cache: new Collection([['apimessage', msg]])
            }

            msg.author = user
            msg.member = member
            msg.channel = channel
            msg.guild = guild

            // done

            var err
            await callbacks.messageCallback(msg).catch((e) => err = e.message)
            if (!messages.length) messages.push(restype == 'json' ? newMessage(err ?? 'No output.') : err ?? 'No output.')

            switch (restype) {
                case 'json':
                    res.type('json').send(messages)
                    break;

                case 'raw':
                    res.type('text').send(messages.join('\n'))
                    break;

                default:
                    const doc = `<!DOCTYPE html><html><head><title>your command sir</title><link rel="icon" href="https://cdn.discordapp.com/attachments/760223418968047629/973329887433736233/94b2caa2c814b2a08f880d0ea57df45e.png"><link rel="stylesheet" href="/assets/discord.css"><script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.5.1/highlight.min.js"></script><script src="/assets/discord.js"></script></head><body class="theme-dark">${messages.join('\n')}</body></html>`
                    res.type('html').send(doc)
                    break;
            }
        })

        app.get('/psfile', async function (_, res) {
            while (!poopyStarted) await sleep(1000)
            const psfiles = mainPoopy.globaldata['psfiles']
            res.redirect(psfiles[Math.floor(Math.random() * psfiles.length)])
        })

        app.get('/invite', async function (_, res) {
            while (!mainPoopy) await sleep(1000)
            res.redirect(`https://discord.com/oauth2/authorize?client_id=${mainPoopy.bot.user.id}&scope=bot%20applications.commands&permissions=275415166152`)
        })

        app.get('/discord', function (_, res) {
            res.redirect(`https://discord.gg/R4nEBP5Ymf`)
        })

        app.use(express.static('html/public'))

        app.use(function (_, res) {
            res.status(404).sendFile(`${__dirname}/html/errorpages/404.html`)
        })

        app.listen(PORT, () => console.log('web is up'))

        setInterval(function () {
            axios.get(process.env.BOT_WEBSITE).catch(() => { })
        }, 300000)
    }

    const Poopy = require('./poopy')

    let tokens = []

    function testCondition() {
        return process.argv.includes('--test') || !__dirname.includes('app')
    }

    if (testCondition()) {
        tokens = [
            {
                TOKEN: process.env.POOPYTEST_TOKEN,
                config: {
                    testing: true,
                    noInfoPost: true,
                    globalPrefix: '2p:',
                    database: 'testdata',
                    intents: 3276799,
                }
            }
        ]
    } else {
        tokens = [
            {
                TOKEN: process.env.POOPY_TOKEN,
                config: {
                    globalPrefix: 'p:',
                    public: true,
                }
            },

            {
                TOKEN: process.env.POOSONIA_TOKEN,
                config: {
                    globalPrefix: 'ps:',
                    database: 'poopypsdata',
                    poosonia: true
                }
            },

            /*{
                TOKEN: process.env.INDIA_TOKEN,
                config: {
                    self: true,
                    globalPrefix: 'i:',
                    database: 'racist',
                    msgcooldown: 3000,
                    useReactions: true,
                    textEmbeds: true,
                    noInfoPost: true,
                    illKillYouIfYouUseEval: []
                }
            }*/
        ]
    }

    var lead = false
    for (var tokendata of tokens) {
        if (!lead) {
            tokendata.config.quitOnDestroy = true
            lead = true
        }

        let poopy = new Poopy(tokendata.config)
        if (!mainPoopy) mainPoopy = poopy

        poopy.start(tokendata.TOKEN).then(() => {
            if (poopy.config.quitOnDestroy) {
                poopyStarted = true
            }
        }).catch((e) => console.log(e))

        await sleep(2000)
    }
}

throng({ workers: 1, start })