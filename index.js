async function main() {
    let poopyStarted = false
    let mainPoopy
    const express = require('express')
    const cors = require('cors')
    const bp = require('body-parser')
    const { EventEmitter } = require('events')
    const fs = require('fs-extra')
    const axios = require('axios')
    const md5 = require('md5')
    const fileType = require('file-type')
    let globalData = require('./modules/globalData')

    const PORT = process.env.PORT || 8080
    const app = express()
    const eventEmitter = new EventEmitter()

    app.use(cors())
    app.use(bp.json())
    app.use(bp.urlencoded({ extended: true }))

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    app.use(function (req, res, next) {
        const isNotSecure = (!req.get('x-forwarded-port') && req.protocol !== 'https') ||
            parseInt(req.get('x-forwarded-port'), 10) !== 443 &&
            (parseInt(req.get('x-forwarded-port'), 10) === parseInt(req.get('x-forwarded-port'), 10))

        if (isNotSecure) {
            return res.redirect(301, `https://${req.get('host')}${req.url}`)
        }

        next()
    })

    app.get('/api/onpoopystart', async function (req, res) {
        res.set({
            'Cache-Control': 'no-cache',
            'Content-Type': 'text/event-stream',
            'Connection': 'keep-alive'
        })
        res.flushHeaders()

        eventEmitter.once('poopystart', () => res.write(`data: true\n\n`))

        res.write('retry: 10000\n\n')
    })

    app.get('/api/text', async function (req, res) {
        for (var i = 0; i < 10; i++) {
            await sleep(1000)
            res.write('fazballs')
        }
    })

    app.post('/api/command', async function (req, res) {
        if (poopyStarted) {
            let sent = false

            if (!req.body || req.body.command != undefined) {
                return res.status(400).type('text').send('You need a command name.')
            }

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

            msg.guild = {
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

            msg.channel = {
                isText: () => true,

                sendTyping: async () => undefined,

                fetchWebhooks: async () => new Map([['apichannel', msg.channel]]),

                createWebhook: async () => msg.channel,

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

                guild: msg.guild,

                owner: mainPoopy.bot.user,

                type: 'GUILD_TEXT',

                id: 'apichannel'
            }

            msg.author = {
                send: async () => msg,
                displayAvatarURL: () => mainPoopy.bot.user.displayAvatarURL({ dynamic: true, size: 1024, format: 'png' }),
                createDM: async () => msg.channel,
                username: 'User',
                dmChannel: msg.channel,
                id: md5(req.ip)
            }

            msg.member = {
                send: async () => msg,
                user: msg.author,
                nickname: 'Member',
                guild: msg.guild,
                roles: {
                    cache: new Map([['apirole', { name: 'owner', id: 'apirole' }]])
                },
                permissions: {
                    has: () => true
                },
                id: md5(req.ip)
            }

            msg.guild.members = {
                fetch: async () => msg.member,
                cache: new Map([[md5(req.ip), msg.member]])
            }

            msg.guild.channels = {
                cache: new Map([['apichannel', msg.channel]])
            }

            msg.channel.messages = {
                fetch: async () => msg,
                cache: new Map([['apimessage', msg]])
            }

            if (poopy.tempdata[msg.guild.id][msg.channel.id]['shut']) {
                return res.status(400).type('text').send('shut')
            }

            if (poopy.data['guild-data'][msg.guild.id]['members'][msg.author.id]['coolDown']) {
                if ((poopy.data['guild-data'][msg.guild.id]['members'][msg.author.id]['coolDown'] - Date.now()) > 0) {
                    return res.status(400).type('text').send(`Calm down! Wait more ${(poopy.data['guild-data'][msg.guild.id]['members'][msg.author.id]['coolDown'] - Date.now()) / 1000} seconds.`)
                } else {
                    poopy.data['guild-data'][msg.guild.id]['members'][msg.author.id]['coolDown'] = false
                }
            }

            if (poopy.config.shit.find(id => id === msg.author.id)) {
                return res.status(400).type('text').send('shit')
            }

            const commandname = req.body.command.toLowerCase()

            const command = mainPoopy.functions.findCommand(commandname)
            const localCommand = mainPoopy.data['guild-data'][msg.guild.id]['localcmds'].find(cmd => cmd.name === commandname)

            if (command || localCommand) {
                if (mainPoopy.data['guild-data'][msg.guild.id]['disabled'].find(cmd => cmd.find(n => n === commandname))) {
                    return res.status(400).type('text').send('This command is disabled here.')
                }

                await mainPoopy.functions.gatherData(msg).catch(() => { })

                var change = await mainPoopy.functions.getKeywordsFor(msg.content, msg, false, { resetattempts: true }).catch(() => { }) ?? 'error'

                msg.oldcontent = msg.content
                msg.content = change

                await mainPoopy.functions.getUrls(msg, { update: true }).catch(() => { })

                const args = msg.content.split(' ')

                if (command) {
                    if (command.cooldown) {
                        poopy.data['guild-data'][msg.guild.id]['members'][msg.author.id]['coolDown'] = (poopy.data['guild-data'][msg.guild.id]['members'][msg.author.id]['coolDown'] || Date.now()) + command.cooldown / ((msg.member.permissions.has('MANAGE_GUILD') || msg.member.roles.cache.find(role => role.name.match(/mod|dev|admin|owner|creator|founder|staff/ig)) || msg.member.permissions.has('MANAGE_MESSAGES') || msg.member.permissions.has('ADMINISTRATOR') || msg.author.id === msg.guild.ownerID) && (command.type === 'Text' || command.type === 'Main') ? 5 : 1)
                    }

                    poopy.vars.cps++
                    poopy.data['bot-data']['commands']++
                    var t = setTimeout(() => {
                        poopy.vars.cps--;
                        clearTimeout(t)
                    }, 1000)

                    poopy.functions.infoPost(`Command \`${commandname}\` used`)
                    await command.execute.call(mainPoopy, msg, args).catch((e) => {
                        if (!sent) res.type('text').send(e.stack)
                    })
                    poopy.data['bot-data']['filecount'] = poopy.vars.filecount
                } else if (localCommand) {
                    poopy.vars.cps++
                    poopy.data['bot-data']['commands']++
                    var t = setTimeout(() => {
                        poopy.vars.cps--;
                        clearTimeout(t)
                    }, 60000)

                    poopy.functions.infoPost(`Command \`${commandname}\` used`)
                    var phrase = await poopy.functions.getKeywordsFor(localCommand.phrase, msg, true).catch(() => { }) ?? 'error'
                    poopy.data['bot-data']['filecount'] = poopy.vars.filecount
                    if (!sent) res.type('text').send(phrase)
                }
            } else {
                res.status(400).type('text').send('Invalid command.')
            }
        } else {
            res.status(102).res.sendFile(`${__dirname}/https/startpage.html`)
        }
    })

    app.get('/psfile', function (req, res) {
        if (poopyStarted) {
            const psfiles = globalData()['bot-data']['psfiles']
            res.redirect(psfiles[Math.floor(Math.random() * psfiles.length)])
        } else {
            res.sendFile(`${__dirname}/https/startpage.html`)
        }
    })

    app.use(express.static('https/public'))

    app.use(function (req, res) {
        res.status(404).sendFile(`${__dirname}/https/errorpages/404.html`)
    })

    app.listen(PORT, () => console.log('web is up'))

    setInterval(function () {
        axios.get(`https://poopies-for-you.herokuapp.com`).catch(() => { })
    }, 300000)

    const Poopy = require('./poopy')

    const tokens = [
        {
            TOKEN: process.env[__dirname.includes('app') ? 'POOPYTOKEN' : 'POOPYTOKEN2'],
            config: {
                testing: !(__dirname.includes('app')),
                globalPrefix: __dirname.includes('app') ? 'p:' : '2p:',
                quitOnDestroy: true
            }
        }
    ]

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