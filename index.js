async function main() {
    let poopyStarted = false
    let mainPoopy
    const express = require('express')
    const cors = require('cors')
    const bp = require('body-parser')
    const fs = require('fs-extra')
    const axios = require('axios')
    const md5 = require('md5')
    const fileType = require('file-type')
    let globalData = require('./modules/globalData')

    const PORT = process.env.PORT || 8080
    const app = express()

    app.use(cors())

    app.use(bp.json())
    app.use(bp.urlencoded({ extended: true }))

    /*app.use(function (req, res, next) {
        const isNotSecure = (!req.get('x-forwarded-port') && req.protocol !== 'https') ||
            parseInt(req.get('x-forwarded-port'), 10) !== 443 &&
            (parseInt(req.get('x-forwarded-port'), 10) === parseInt(req.get('x-forwarded-port'), 10))

        if (isNotSecure) {
            return res.redirect(301, `https://${req.get('host')}${req.url}`)
        }

        next()
    })*/

    app.get('/api/poopystarted', async function (req, res) {
        res.type('json').send({
            started: poopyStarted
        })
    })

    app.post('/api/command', async function (req, res) {
        if (poopyStarted) {
            let sent = false

            console.log(req.body)

            if (!req.body || req.body.command != undefined) {
                res.status(400).type('text').send('You need a command name.')
                return
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
                members: {
                    fetch: async () => msg.member,
                    cache: new Map([[md5(req.ip), msg.member]])
                },
                emojis: {
                    cache: new Map()
                },
                channels: {
                    cache: new Map()
                },
                ownerID: md5(req.ip),
                id: 'apiguild'
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
                                if (embed.fields) contents.push(embed.fields.map(field => `${field.name ?? ''}\n${field.value ?? ''}`).join('\n'))
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

                messages: {
                    fetch: async () => msg,
                    cache: new Map([['apimessage', msg]])
                },

                type: 'GUILD_TEXT',

                id: 'apichannel'
            }

            msg.author = {
                send: async () => msg,
                displayAvatarURL: () => mainPoopy.bot.user.displayAvatarURL({ dynamic: true, size: 1024, format: 'png' }),
                username: 'User',
                dmChannel: msg.channel,
                id: md5(req.ip)
            }

            msg.member = {
                send: async () => msg,
                user: msg.author,
                nickname: 'Member',
                guild: msg.guild,
                permissions: {
                    has: () => true
                },
                id: md5(req.ip)
            }

            const commandname = req.body.command.toLowerCase()

            const command = mainPoopy.functions.findCommand(req.body.command.toLowerCase())
            const localCommand = mainPoopy.data['guild-data'][msg.guild.id]['localcmds'].find(cmd => cmd.name === commandname)

            if (command || localCommand) {
                if (mainPoopy.data['guild-data'][msg.guild.id]['disabled'].find(cmd => cmd.find(n => n === commandname))) {
                    res.status(400).type('text').send('This command was disabled by someone.')
                }

                await mainPoopy.functions.gatherData(msg).catch(() => { })

                var change = await mainPoopy.functions.getKeywordsFor(msg.content, msg, false, { resetattempts: true }).catch(() => { }) ?? 'error'

                msg.oldcontent = msg.content
                msg.content = change

                await mainPoopy.functions.getUrls(msg, { update: true }).catch(() => { })

                const args = msg.content.split(' ')

                await command.execute.call(mainPoopy, msg, args).catch((e) => {
                    if (!sent) res.type('text').send(e.stack)
                })
            } else if (!sent) {
                res.status(400).type('text').send('Command not found.')
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
}

main()