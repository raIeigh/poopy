const throng = require('throng')
const fs = require('fs-extra')

function updateEnvironment() {
    if (!fs.existsSync('.env')) return

    const env = fs.readFileSync('.env').toString()

    for (const line of env.split('\n')) {
        if (!line || !line.includes("=") || line.startsWith("#")) continue

        let [key, value] = line.split("=", 2)
        if (!key || !value || process.env[key]) continue

        process.env[key.trim()] = value.trim()
    }
}

async function start() {
    let poopyStarted = false
    let poopy
    let { APIMessage } = require('./src/modules')
    let { sleep, escapeHTML } = require('./src/functions')
    
    if (process.env.RAILWAY_STATIC_URL && !process.env.BOT_WEBSITE) process.env.BOT_WEBSITE = `https://${process.env.RAILWAY_STATIC_URL}`

    if (process.env.BOT_WEBSITE) {
        const express = require('express')
        const cors = require('cors')
        const bp = require('body-parser')
        const axios = require('axios')

        const PORT = process.env.PORT || 8080
        const app = express()

        app.use(cors())
        app.use(bp.json())
        app.use(bp.urlencoded({ extended: true }))
        /* ok so railway already uses ssl encryption
        app.use(function (req, res, next) {
            const isNotSecure = (!req.get('x-forwarded-port') && req.protocol !== 'https') ||
                parseInt(req.get('x-forwarded-port'), 10) !== 443 &&
                (parseInt(req.get('x-forwarded-port'), 10) === parseInt(req.get('x-forwarded-port'), 10))

            if (isNotSecure && !req.hostname.includes('localhost')) {
                return res.redirect(301, `https://${req.get('host')}${req.url}`)
            }

            next()
        }) */

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
            res.type('json').send(poopy.globaldata['psfiles'])
        })

        app.get('/api/pspasta', async function (req, res) {
            if (req.query.nowait && !poopyStarted) {
                res.end()
                return
            }

            while (!poopyStarted) await sleep(1000)
            res.type('json').send(poopy.globaldata['pspasta'])
        })

        app.get('/ubervoices', async function (_, res) {
            while (!poopyStarted) await sleep(1000)
            let vars = poopy.vars
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

            let callbacks = poopy.callbacks
            let data = poopy.data

            req.body.restype = req.body.restype ?? 'html'
            req.body = req.body ?? {}

            let messages = []

            var msg = new APIMessage({ req, res, poopy, messages })

            if (!data.guildData[msg.guild.id]) data.guildData[msg.guild.id] = {}
            if (data.guildData[msg.guild.id]['prefix'] == undefined) data.guildData[msg.guild.id]['prefix'] = ''
            if (data.guildData[msg.guild.id]['keyexec'] == undefined) data.guildData[msg.guild.id]['keyexec'] = 2

            var err
            await callbacks.messageCallback(msg).catch((e) => err = e.message)
            if (!messages.length) messages.push(req.body.restype == 'json' ? new APIMessage({ req, res, poopy, messages }, err ?? 'No output.') : err ?? 'No output.')

            switch (req.body.restype) {
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
            const psfiles = poopy.globaldata['psfiles']
            res.redirect(psfiles[Math.floor(Math.random() * psfiles.length)])
        })

        app.get('/invite', async function (_, res) {
            while (!poopy) await sleep(1000)
            res.redirect(`https://discord.com/oauth2/authorize?client_id=${poopy.bot.user.id}&scope=bot%20applications.commands&permissions=275415166152`)
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
        return process.argv.includes('--test')
    }

    if (testCondition()) {
        tokens = [
            {
                TOKEN: process.env.TEST_TOKEN,
                config: {
                    testing: true,
                    noInfoPost: true,
                    globalPrefix: '2p:',
                    database: 'testdata',
                    intents: 3276799
                }
            },

            {
                TOKEN: process.env.INDIA_TOKEN,
                config: {
                    testing: true,
                    self: true,
                    globalPrefix: 'i:',
                    database: 'testracist',
                    msgcooldown: 3000,
                    pingresponselimit: 5,
                    pingresponsecooldown: 120000,
                    useReactions: true,
                    textEmbeds: true,
                    noInfoPost: true,
                    intents: 3276799,
                    allowbotusage: true,
                    illKillYouIfYouUseEval: []
                }
            }
        ]
    } else {
        tokens = [
            {
                TOKEN: process.env.DEFAULT_TOKEN,
                config: {
                    globalPrefix: 'p:',
                    public: true
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
                    intents: 3276799,
                    illKillYouIfYouUseEval: []
                }
            },
        ]
    }

    for (var tokendata of tokens) {
        if (!tokendata?.TOKEN) continue

        if (!poopy) tokendata.config.quitOnDestroy = true

        let poopoo = new Poopy(tokendata.config)
        if (!poopy) poopy = poopoo

        poopoo.start(tokendata.TOKEN).then(() => {
            if (poopoo.config.quitOnDestroy) {
                poopyStarted = true
            }
        }).catch((e) => console.log(e))

        await sleep(2000)
    }
}

updateEnvironment()
throng({ workers: 1, start }) // My poopy will never die
