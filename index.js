async function main() {
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
    let globalData = require('./modules/globalData')

    const PORT = process.env.PORT || 8080
    const app = express()
    const eventEmitter = new EventEmitter()

    app.use(cors())
    app.use(bp.json())
    app.use(bp.urlencoded({ extended: true }))
    app.use(function (req, res, next) {
        const isNotSecure = (!req.get('x-forwarded-port') && req.protocol !== 'https') ||
            parseInt(req.get('x-forwarded-port'), 10) !== 443 &&
            (parseInt(req.get('x-forwarded-port'), 10) === parseInt(req.get('x-forwarded-port'), 10))

        if (isNotSecure) {
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

    app.get('/api/waitPoopyStart', async function (req, res) {
        while (!poopyStarted) await sleep(1000)
        res.end()
    })

    app.get('/api/globalData', async function (req, res) {
        while (!poopyStarted) await sleep(1000)
        res.type('json').send(globalData())
    })

    app.post('/api/command', async function (req, res) {
        if (poopyStarted) {
            let sent = false

            res.type('text')

            if (!req.body || req.body.command == undefined) {
                return res.status(400).send('You need a command name.')
            }

            let messages = []

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

            const send = async function (payload) {
                if (sent) return

                if (typeof (payload) == 'string') {
                    var message = `<div class="message"><div class="contents">${escapeHTML(payload)}</div></div>`
                    messages.push(message)
                    return message
                } else {
                    var contents = []
                    var container = []

                    if (payload.content != undefined) contents.push(escapeHTML(payload.content))

                    if (payload.embeds && payload.embeds.length > 0) {
                        let textEmbed = []

                        payload.embeds.forEach(embed => {
                            if (embed.thumbnail && embed.thumbnail.url) textEmbed.push(`<img src="${escapeHTML(embed.thumbnail.url)}" align="right">`)
                            if (embed.author && embed.author.name) textEmbed.push(escapeHTML(embed.author.name))
                            if (embed.title) textEmbed.push(escapeHTML(embed.title))
                            if (embed.description) textEmbed.push(escapeHTML(embed.description))
                            if (embed.fields && embed.fields.length > 0) textEmbed.push(embed.fields.map(field => escapeHTML(`${field.name ?? ''}\n${field.value ?? ''}`)).join('\n'))
                            if (embed.image && embed.image.url) textEmbed.push(`<img src="${escapeHTML(embed.thumbnail.url)}">`)
                            if (embed.footer && embed.footer.text) textEmbed.push(escapeHTML(embed.footer.text))
                        })

                        contents.push(textEmbed.join('\n'))
                    }

                    if (payload.files && payload.files.length > 0) {
                        for (var i in payload.files) {
                            var attachment = payload.files[i].attachment

                            function wrapImage(fileinfo) {
                                var width = fileinfo.info.width
                                var height = fileinfo.info.height

                                var embedWidth = width
                                var embedHeight = height

                                if (width == height && width > 300 && height > 300) {
                                    embedWidth = 300
                                    embedHeight = 300
                                }

                                if (width > 400) {
                                    embedWidth = 400
                                    embedHeight /= width / 400
                                }

                                if (height > 300) {
                                    embedWidth /= height / 300
                                    embedHeight = 300
                                }

                                return `<a href="${fileinfo.path}" target="_blank"><img alt="Image" src="${fileinfo.path}" style="width: ${embedWidth}px; height: ${embedHeight}px;"></a>`
                            }

                            function wrapVideo(fileinfo) {
                                var width = fileinfo.info.width
                                var height = fileinfo.info.height

                                var embedWidth = width
                                var embedHeight = height

                                if (width == height && width > 300 && height > 300) {
                                    embedWidth = 300
                                    embedHeight = 300
                                }

                                if (width > 400) {
                                    embedWidth = 400
                                    embedHeight /= width / 400
                                }

                                if (height > 300) {
                                    embedWidth /= height / 300
                                    embedHeight = 300
                                }

                                return `<video controls height="${embedHeight}" width="${embedWidth}" src="${fileinfo.path}"></video>`
                            }

                            function wrapAudio(fileinfo) {
                                return `<audio controls src="${fileinfo.path}"></audio>`
                            }

                            var fileinfo

                            if (mainPoopy.vars.validUrl.test(attachment)) {
                                fileinfo = await poopy.functions.validateFile(attachment, 'very true').catch(() => { })
                            } else {
                                fileinfo = await poopy.functions.validateFileFromPath(attachment, 'very true').catch(() => { })
                            }

                            if (!fileinfo) continue

                            var attachHtml

                            switch (fileinfo.type.mime) {
                                case 'image':
                                    attachHtml = wrapImage(fileinfo)
                                    break;

                                case 'video':
                                    attachHtml = wrapVideo(fileinfo)
                                    break;

                                case 'audio':
                                    attachHtml = wrapAudio(fileinfo)
                                    break;

                                case 'text':
                                    attachHtml = escapeHTML(fileinfo.buffer.toString())
                                    break;

                                default:
                                    attachHtml = `<a href="${fileinfo.path}">${fileinfo.name}</a>`
                                    break;
                            }

                            container.push(attachHtml)
                        }
                    }

                    message.push(`<div class="contents">${contents.join('\n')}</div>`)
                    message.push(`<div class="container">${container.join('\n')}</div>`)
                    message = `<div class="message">${message.join('\n')}</div>`

                    messages.push(message)

                    return message
                }
            }

            channel.send = send
            channel.edit = send

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

            await mainPoopy.functions.gatherData(msg).catch(() => { })

            if (mainPoopy.tempdata[msg.guild.id][msg.channel.id]['shut']) {
                return res.status(400).send('shut')
            }

            if (mainPoopy.data['guild-data'][msg.guild.id]['members'][msg.author.id]['coolDown']) {
                if ((mainPoopy.data['guild-data'][msg.guild.id]['members'][msg.author.id]['coolDown'] - Date.now()) > 0) {
                    return res.status(400).send(`Calm down! Wait more ${(mainPoopy.data['guild-data'][msg.guild.id]['members'][msg.author.id]['coolDown'] - Date.now()) / 1000} seconds.`)
                } else {
                    mainPoopy.data['guild-data'][msg.guild.id]['members'][msg.author.id]['coolDown'] = false
                }
            }

            if (mainPoopy.config.shit.find(id => id === msg.author.id)) {
                return res.status(400).send('shit')
            }

            const commandname = req.body.command.toLowerCase()

            const command = mainPoopy.functions.findCommand(commandname)
            const localCommand = mainPoopy.data['guild-data'][msg.guild.id]['localcmds'].find(cmd => cmd.name === commandname)

            if (command || localCommand) {
                if (mainPoopy.data['guild-data'][msg.guild.id]['disabled'].find(cmd => cmd.find(n => n === commandname))) {
                    return res.status(400).send('This command is disabled here.')
                }

                var change = await mainPoopy.functions.getKeywordsFor(msg.content, msg, false, { resetattempts: true }).catch(() => { }) ?? 'error'

                msg.oldcontent = msg.content
                msg.content = change

                await mainPoopy.functions.getUrls(msg, { update: true }).catch(() => { })

                const args = msg.content.split(' ')

                if (command) {
                    if (command.cooldown) {
                        mainPoopy.data['guild-data'][msg.guild.id]['members'][msg.author.id]['coolDown'] = (mainPoopy.data['guild-data'][msg.guild.id]['members'][msg.author.id]['coolDown'] || Date.now()) + command.cooldown / ((msg.member.permissions.has('MANAGE_GUILD') || msg.member.roles.cache.find(role => role.name.match(/mod|dev|admin|owner|creator|founder|staff/ig)) || msg.member.permissions.has('MANAGE_MESSAGES') || msg.member.permissions.has('ADMINISTRATOR') || msg.author.id === msg.guild.ownerID) && (command.type === 'Text' || command.type === 'Main') ? 5 : 1)
                    }

                    mainPoopy.vars.cps++
                    mainPoopy.data['bot-data']['commands']++
                    var t = setTimeout(() => {
                        mainPoopy.vars.cps--;
                        clearTimeout(t)
                    }, 1000)

                    mainPoopy.functions.infoPost(`Command \`${commandname}\` used`)
                    await command.execute.call(mainPoopy, msg, args).catch((e) => {
                        messages.push(`<div class="message"><div class="contents">${escapeHTML(e.stack)}</div></div>`)
                    })
                    mainPoopy.data['bot-data']['filecount'] = mainPoopy.vars.filecount
                    if (!sent) {
                        sent = true
                        res.type('html').send(`<!DOCTYPE html><html><head><title>your command sir</title><link rel="stylesheet" href="/assets/discord.css"><script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.5.1/highlight.min.js"></script><script src="/assets/discord.js"></script></head><body class="theme-dark">${messages.join('\n')}</body></html>`)
                    }
                } else if (localCommand) {
                    mainPoopy.vars.cps++
                    mainPoopy.data['bot-data']['commands']++
                    var t = setTimeout(() => {
                        mainPoopy.vars.cps--;
                        clearTimeout(t)
                    }, 60000)

                    mainPoopy.functions.infoPost(`Command \`${commandname}\` used`)
                    var phrase = await mainPoopy.functions.getKeywordsFor(localCommand.phrase, msg, true).catch(() => { }) ?? 'error'
                    mainPoopy.data['bot-data']['filecount'] = mainPoopy.vars.filecount
                    if (!sent) {
                        sent = true
                        messages.push(`<div class="message"><div class="contents">${escapeHTML(phrase)}</div></div>`)
                        res.type('html').send(`<!DOCTYPE html><html><head><title>your command sir</title><link rel="stylesheet" href="/assets/discord.css"><script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.5.1/highlight.min.js"></script><script src="/assets/discord.js"></script></head><body class="theme-dark">${messages.join('\n')}</body></html>`)
                    }
                }
            } else {
                res.status(400).send('Invalid command.')
            }
        } else {
            res.status(102).sendFile(`${__dirname}/html/startPage.html`)
        }
    })

    app.get('/psfile', function (req, res) {
        if (poopyStarted) {
            const psfiles = globalData()['bot-data']['psfiles']
            res.redirect(psfiles[Math.floor(Math.random() * psfiles.length)])
        } else {
            res.sendFile(`${__dirname}/html/startPage.html`)
        }
    })

    app.use(express.static('html/public'))

    app.use(function (req, res) {
        res.status(404).sendFile(`${__dirname}/html/errorpages/404.html`)
    })

    app.listen(PORT, () => console.log('web is up'))

    setInterval(function () {
        axios.get(`https://poopies-for-you.herokuapp.com`).catch(() => { })
    }, 300000)

    const Poopy = require('./poopy')

    const tokens = []

    if (__dirname.includes('app')) {
        tokens.push({
            TOKEN: process.env.POOPYTOKEN,
            config: {
                testing: false,
                globalPrefix: 'p:',
                quitOnDestroy: true
            }
        })
    } else {
        tokens.push({
            TOKEN: process.env.POOPYTOKEN2,
            config: {
                testing: true,
                globalPrefix: '2p:',
                notSave: true,
                quitOnDestroy: true
            }
        })
    }

    for (var i in tokens) {
        const tokendata = tokens[i]

        let poopy
        if (typeof tokendata == 'string') {
            poopy = new Poopy()
        } else {
            poopy = new Poopy(tokendata.config)
        }

        await poopy.start(tokendata.TOKEN)

        if (!mainPoopy) mainPoopy = poopy
    }

    poopyStarted = true
    eventEmitter.emit('poopystarted')
}

main()