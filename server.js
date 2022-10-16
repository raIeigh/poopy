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
                replaceAsync, gatherData, getKeywordsFor,
                getUrls, findCommand, infoPost } = mainPoopy.functions
            let vars = mainPoopy.vars
            let data = mainPoopy.data
            let tempdata = mainPoopy.tempdata
            let bot = mainPoopy.bot
            let sent = false
    
            var restype = req.body.restype ?? 'html'
    
            if (!req.body || req.body.args == undefined) {
                return res.type('text').status(400).send('You need a command name.')
            }
    
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
    
                attachments: new Map(),

                embeds: [],

                stickers: new Map(),
    
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
                ownerID: CryptoJS.MD5(req.ip).toString(),
                id: CryptoJS.MD5(req.ip).toString().split('').reverse().join('')
            }
    
            let channel = {
                isText: () => true,
    
                sendTyping: async () => { },
    
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
                    cache: new Map([['apirole', { name: 'owner', id: 'apirole' }]])
                },
                permissions: {
                    has: () => true
                },
                id: CryptoJS.MD5(req.ip).toString()
            }
    
            function newMessage(payload) {
                var newMsg = { ...msg }
    
                newMsg.content = payload.content ?? ''
                newMsg.embeds = payload.embeds ?? []
    
                var attachments = payload.files ?? []
                var i = 0
                newMsg.attachments = new Map(attachments.map(attachment => [`apiattachment${i++}`, {
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
                if (sent) return
    
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
    
                        if (embed.thumbnail && embed.thumbnail.url) textEmbed.push(await createEmbed(embed.thumbnail.url))
                        if (embed.author && embed.author.name) textEmbed.push(escapeHTML(embed.author.name))
                        if (embed.title) textEmbed.push(escapeHTML(embed.title))
                        if (embed.description) textEmbed.push(escapeHTML(embed.description))
                        if (embed.fields && embed.fields.length > 0) textEmbed.push(embed.fields.map(field => escapeHTML(`${field.name ?? ''}\n${field.value ?? ''}`)).join('\n'))
                        if (embed.image && embed.image.url) textEmbed.push(await createEmbed(embed.image.url))
                        if (embed.footer && embed.footer.text) textEmbed.push(escapeHTML(embed.footer.text))
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
    
            member.guild = guild
            channel.guild = guild
    
            guild.members = {
                fetch: async () => member,
                cache: new Map([[CryptoJS.MD5(req.ip).toString(), member]])
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
            msg.channel = channel
            msg.guild = guild
            // done
    
            if (mainPoopy.globaldata['shit'].find(id => id === msg.author.id)) {
                return res.type('text').status(400).send('shit')
            }
    
            await gatherData(msg).catch(() => { })
    
            if (tempdata[msg.guild.id][msg.channel.id]['shut']) {
                return res.type('text').status(400).send('shut')
            }
    
            if (data['guild-data'][msg.guild.id]['members'][msg.author.id]['coolDown']) {
                if ((data['guild-data'][msg.guild.id]['members'][msg.author.id]['coolDown'] - Date.now()) > 0) {
                    return res.type('text').status(400).send(`Calm down! Wait more ${(data['guild-data'][msg.guild.id]['members'][msg.author.id]['coolDown'] - Date.now()) / 1000} seconds.`)
                } else {
                    data['guild-data'][msg.guild.id]['members'][msg.author.id]['coolDown'] = false
                }
            }
    
            const change = await getKeywordsFor(msg.content, msg, false, { resetattempts: true }).catch(() => { }) ?? 'error'
    
            msg.oldcontent = msg.content
            msg.content = change
    
            await getUrls(msg, { update: true }).catch(() => { })
    
            const args = msg.content.substring(config.globalPrefix.length).split(' ')
            const commandname = args.slice(0, 1)[0].toLowerCase()
    
            const command = findCommand(commandname)
            const localCommand = data['guild-data'][msg.guild.id]['localcmds'].find(cmd => cmd.name === commandname)
    
            if (command || localCommand) {
                if (data['guild-data'][msg.guild.id]['disabled'].find(cmd => cmd.find(n => n === commandname))) {
                    return res.type('text').status(400).send('This command is disabled here.')
                }
    
                if (command) {
                    if (command.cooldown) {
                        data['guild-data'][msg.guild.id]['members'][msg.author.id]['coolDown'] = (data['guild-data'][msg.guild.id]['members'][msg.author.id]['coolDown'] || Date.now()) + command.cooldown / ((msg.member.permissions.has('ManageGuild') || msg.member.roles.cache.find(role => role.name.match(/mod|dev|admin|owner|creator|founder|staff/ig)) || msg.member.permissions.has('ManageMessages') || msg.member.permissions.has('Administrator') || msg.author.id === msg.guild.ownerID) && (command.type === 'Text' || command.type === 'Main') ? 5 : 1)
                    }
    
                    vars.cps++
                    data['bot-data']['commands']++
                    let t = setTimeout(() => {
                        vars.cps--;
                        clearTimeout(t)
                    }, 1000)
    
                    infoPost(`Command \`${commandname}\` used`)
                    await command.execute.call(mainPoopy, msg, args).catch((e) => {
                        if (restype == 'json') messages.push({
                            content: e.stack
                        })
                        else messages.push(`<div class="message"><div class="contents">${escapeHTML(e.stack)}</div></div>`)
                    })
                    data['bot-data']['filecount'] = vars.filecount
                    if (!sent) {
                        sent = true
                        if (restype == 'json') {
                            res.type('json').send(messages)
                        } else if (restype == 'raw') {
                            res.type('text').send(messages.join('\n'))
                        } else {
                            const doc = `<!DOCTYPE html><html><head><title>your command sir</title><link rel="icon" href="https://cdn.discordapp.com/attachments/760223418968047629/973329887433736233/94b2caa2c814b2a08f880d0ea57df45e.png"><link rel="stylesheet" href="/assets/discord.css"><script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.5.1/highlight.min.js"></script><script src="/assets/discord.js"></script></head><body class="theme-dark">${messages.join('\n')}</body></html>`
                            res.type('html').send(doc)
                        }
                    }
                } else if (localCommand) {
                    vars.cps++
                    data['bot-data']['commands']++
                    var t = setTimeout(() => {
                        vars.cps--;
                        clearTimeout(t)
                    }, 60000)
    
                    infoPost(`Command \`${commandname}\` used`)
                    var phrase = await getKeywordsFor(localCommand.phrase, msg, true).catch((e) => {
                        if (restype == 'json') messages.push({
                            content: e.stack
                        })
                        else messages.push(`<div class="message"><div class="contents">${escapeHTML(e.stack)}</div></div>`)
                    }) ?? 'error'
                    data['bot-data']['filecount'] = vars.filecount
                    if (!sent) {
                        sent = true
                        if (restype == 'json') {
                            messages.push({
                                content: phrase
                            })
                            res.type('json').send(messages)
                        } else if (restype == 'raw') {
                            messages.push(phrase)
                            res.type('text').send(messages.join('\n'))
                        } else {
                            messages.push(`<div class="message"><div class="contents">${escapeHTML(phrase)}</div></div>`)
                            const doc = `<!DOCTYPE html><html><head><title>your command sir</title><link rel="icon" href="https://cdn.discordapp.com/attachments/760223418968047629/973329887433736233/94b2caa2c814b2a08f880d0ea57df45e.png"><link rel="stylesheet" href="/assets/discord.css"><script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.5.1/highlight.min.js"></script><script src="/assets/discord.js"></script></head><body class="theme-dark">${messages.join('\n')}</body></html>`
                            res.type('html').send(doc)
                        }
                    }
                }
            } else {
                res.status(400).send('Invalid command.')
            }
        })
    
        app.get('/psfile', function (_, res) {
            if (poopyStarted) {
                const psfiles = mainPoopy.globaldata['psfiles']
                res.redirect(psfiles[Math.floor(Math.random() * psfiles.length)])
            } else {
                res.sendFile(`${__dirname}/html/startPage.html`)
            }
        })
    
        app.get('/invite', function (_, res) {
            res.redirect(`https://discord.com/oauth2/authorize?client_id=789189158639501312&scope=bot%20applications.commands&permissions=275415166152`)
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
        return !__dirname.includes('app')
    }

    if (testCondition()) {
        tokens = [
            {
                TOKEN: process.env.POOPYTEST_TOKEN,
                config: {
                    testing: true,
                    globalPrefix: '2p:',
                    intents: 3276799,
                    quitOnDestroy: true
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
                    quitOnDestroy: true
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

            {
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
            }
        ]
    }

    for (var tokendata of tokens) {
        let poopy = new Poopy(tokendata.config)

        poopy.start(tokendata.TOKEN).then(() => {
            if (poopy.config.quitOnDestroy) {
                mainPoopy = poopy
                poopyStarted = true
            }
        }).catch((e) => console.log(e))

        await sleep(2000)
    }
}

throng({ workers: 1, start })