async function start() {
    let poopyStarted = false
    let mainPoopy
    const express = require('express')
    const cors = require('cors')
    const bp = require('body-parser')
    const { EventEmitter } = require('events')
    const fs = require('fs-extra')
    const fileType = require('file-type')
    const axios = require('axios')
    const md5 = require('md5')
    const Queue = require('bull')
    let globalData = require('./modules/globalData')

    const PORT = process.env.PORT || 8080
    const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379'
    const app = express()
    const eventEmitter = new EventEmitter()
    let ffmpegQueue = new Queue('ffmpeg', REDIS_URL)

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

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    function escapeHTML(value) {
        return value
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;')
    }

    function unescapeHTML(value) {
        return value
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&apos;/g, '\'')
    }

    app.get('/api/ffmpegTest', async function (req, res) {
        let job = await ffmpegQueue.add();
        res.type('text').send(job.id)
    })

    app.get('/api/ffmpegTest/:id', async function (req, res) {
        let id = req.params.id;
        let job = await ffmpegQueue.getJob(id);
        
        if (job === null) {
            res.status(404).end();
        } else {
            res.json(job);
        }
    })

    app.get('/api/waitPoopyStart', async function (req, res) {
        while (!poopyStarted) await sleep(1000)
        res.end()
    })

    app.get('/api/globalData', async function (req, res) {
        while (!poopyStarted) await sleep(1000)
        res.type('json').send(globalData())
    })

    app.get('/ubervoices', async function (req, res) {
        while (!poopyStarted) await sleep(1000)
        var listings = [[], [], []]
        var li = 0

        for (var i in mainPoopy.vars.ubercategories) {
            var category = mainPoopy.vars.ubercategories[i]
            listings[li % listings.length].push(category)
            li++
        }

        res.type('html').send(`<!DOCTYPE html><html><head><title>uberduck voices</title><link rel="icon" href="https://uberduck.ai/favicon.ico"><meta property="og:image" content="https://uberduck.ai/uberduck-circle.png"><meta property="og:title" content="uberudcucking"><meta property="og:description" content="make sure to copy the name after the &quot;--->&quot; arrow"></head><body style="font-family: monospace; display: grid; grid-template-columns: ${listings.map(() => 'auto').join(' ')};">${listings.map(listing => `<div>${listing.map(category => `<div style="background-color: #efefef; border: 1px solid #ccc; border-radius: 10px; padding: 10px; margin: 10px 5px;"><h2 style="margin: 0;">${escapeHTML(category.name)}</h2><br>${category.voices.map(vc => `${escapeHTML(vc.display_name)} ---&gt; <b>${escapeHTML(vc.name)}</b>`).join('<br>')}</div>`).join('')}</div>`).join('')}</body></html>`)
    })

    app.post('/api/command', async function (req, res) {
        while (!poopyStarted) await sleep(1000)

        let sent = false

        var restype = req.body.restype ?? 'html'

        if (!req.body || req.body.args == undefined) {
            return res.type('text').status(400).send('You need a command name.')
        }

        let messages = []

        let msg = {
            content: `${mainPoopy.config.globalPrefix}${req.body.args}`,

            id: 'apimessage',

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
            id: md5(req.ip).split('').reverse().join('')
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

            owner: mainPoopy.bot.user,

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

            if (mainPoopy.vars.validUrl.test(url)) {
                fileinfo = await mainPoopy.functions.validateFile(url, 'very true').catch(() => { })
            } else {
                fileinfo = await mainPoopy.functions.validateFileFromPath(url, 'very true').catch(() => { })
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

                        if (!mainPoopy.vars.validUrl.test(attachment)) {
                            var fileinfo = await mainPoopy.functions.validateFileFromPath(attachment, 'very true').catch(() => { })

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
                    if (mainPoopy.vars.validUrl.test(attachment)) {
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
                contents[i] = await mainPoopy.functions.replaceAsync(contents[i], new RegExp(mainPoopy.vars.validUrl, 'g'), async (url) => {
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
        msg.channel = channel
        msg.guild = guild

        if (globalData()['bot-data']['shit'].find(id => id === msg.author.id)) {
            return res.type('text').status(400).send('shit')
        }

        await mainPoopy.functions.gatherData(msg).catch(() => { })

        if (mainPoopy.tempdata[msg.guild.id][msg.channel.id]['shut']) {
            return res.type('text').status(400).send('shut')
        }

        if (mainPoopy.data['guild-data'][msg.guild.id]['members'][msg.author.id]['coolDown']) {
            if ((mainPoopy.data['guild-data'][msg.guild.id]['members'][msg.author.id]['coolDown'] - Date.now()) > 0) {
                return res.type('text').status(400).send(`Calm down! Wait more ${(mainPoopy.data['guild-data'][msg.guild.id]['members'][msg.author.id]['coolDown'] - Date.now()) / 1000} seconds.`)
            } else {
                mainPoopy.data['guild-data'][msg.guild.id]['members'][msg.author.id]['coolDown'] = false
            }
        }

        const change = await mainPoopy.functions.getKeywordsFor(msg.content, msg, false, { resetattempts: true }).catch(() => { }) ?? 'error'

        msg.oldcontent = msg.content
        msg.content = change

        await mainPoopy.functions.getUrls(msg, { update: true }).catch(() => { })

        const args = msg.content.substring(mainPoopy.config.globalPrefix.length).split(' ')
        const commandname = args.slice(0, 1)[0].toLowerCase()

        const command = mainPoopy.functions.findCommand(commandname)
        const localCommand = mainPoopy.data['guild-data'][msg.guild.id]['localcmds'].find(cmd => cmd.name === commandname)

        if (command || localCommand) {
            if (mainPoopy.data['guild-data'][msg.guild.id]['disabled'].find(cmd => cmd.find(n => n === commandname))) {
                return res.type('text').status(400).send('This command is disabled here.')
            }

            if (command) {
                if (command.cooldown) {
                    mainPoopy.data['guild-data'][msg.guild.id]['members'][msg.author.id]['coolDown'] = (mainPoopy.data['guild-data'][msg.guild.id]['members'][msg.author.id]['coolDown'] || Date.now()) + command.cooldown / ((msg.member.permissions.has('MANAGE_GUILD') || msg.member.roles.cache.find(role => role.name.match(/mod|dev|admin|owner|creator|founder|staff/ig)) || msg.member.permissions.has('MANAGE_MESSAGES') || msg.member.permissions.has('ADMINISTRATOR') || msg.author.id === msg.guild.ownerID) && (command.type === 'Text' || command.type === 'Main') ? 5 : 1)
                }

                mainPoopy.vars.cps++
                mainPoopy.data['bot-data']['commands']++
                let t = setTimeout(() => {
                    mainPoopy.vars.cps--;
                    clearTimeout(t)
                }, 1000)

                mainPoopy.functions.infoPost(`Command \`${commandname}\` used`)
                await command.execute.call(mainPoopy, msg, args).catch((e) => {
                    if (restype == 'json') messages.push({
                        content: e.stack
                    })
                    else messages.push(`<div class="message"><div class="contents">${escapeHTML(e.stack)}</div></div>`)
                })
                mainPoopy.data['bot-data']['filecount'] = mainPoopy.vars.filecount
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
                mainPoopy.vars.cps++
                mainPoopy.data['bot-data']['commands']++
                var t = setTimeout(() => {
                    mainPoopy.vars.cps--;
                    clearTimeout(t)
                }, 60000)

                mainPoopy.functions.infoPost(`Command \`${commandname}\` used`)
                var phrase = await mainPoopy.functions.getKeywordsFor(localCommand.phrase, msg, true).catch((e) => {
                    if (restype == 'json') messages.push({
                        content: e.stack
                    })
                    else messages.push(`<div class="message"><div class="contents">${escapeHTML(e.stack)}</div></div>`)
                }) ?? 'error'
                mainPoopy.data['bot-data']['filecount'] = mainPoopy.vars.filecount
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
            const psfiles = globalData()['bot-data']['psfiles']
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
        axios.get(`https://poopies-for-you.herokuapp.com`).catch(() => { })
    }, 300000)
    
    ffmpegQueue.on('global:completed', (jobId, result) => {
        console.log(`Job completed with result ${result}`);
    });

    const Poopy = require('./poopy')

    let tokens = []

    if (__dirname.includes('app')) {
        tokens = [
            {
                TOKEN: process.env.POOPYTOKEN,
                config: {
                    globalPrefix: 'p:',
                    quitOnDestroy: true
                }
            },

            {
                TOKEN: process.env.INDIATOKEN,
                config: {
                    self: true,
                    globalPrefix: 'i:',
                    mongodatabase: 'racist',
                    msgcooldown: 3000,
                    useReactions: true,
                    textEmbeds: true,
                    noInfoPost: true,
                    illKillYouIfYouUseEval: []
                }
            }
        ]
    } else {
        tokens = [
            {
                TOKEN: process.env.POOPYTOKEN2,
                config: {
                    testing: true,
                    globalPrefix: '2p:',
                    quitOnDestroy: true
                }
            }
        ]
    }
    
    if (fs.existsSync('node_modules/@jimp/plugin-print')) {
        fs.rmSync('node_modules/@jimp/plugin-print', { force: true, recursive: true })
        fs.copySync('modules/plugin-print', 'node_modules/@jimp/plugin-print', { recursive: true })
    }

    tokens.forEach(async tokendata => {
        let poopy
        if (typeof tokendata == 'string') {
            poopy = new Poopy()
        } else {
            poopy = new Poopy(tokendata.config)
        }

        await poopy.start(tokendata.TOKEN)

        if (!mainPoopy) {
            mainPoopy = poopy
            poopyStarted = true
        }
    })

    eventEmitter.emit('poopystarted')
}

start()