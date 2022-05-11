async function main() {
    const Poopy = require('./poopy')
    var poopyStarted = false
    const express = require('express')
    const axios = require('axios')
    const cors = require('cors')
    var globalData = require('./modules/globalData')
    var mongolia = false

    const app = express()
    const PORT = process.env.PORT || 8080

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    app.use(cors())

    app.get('/poopystarted', async function (req, res, next) {
        res.type('json').send({
            started: poopyStarted
        })
    })

    app.get('/psfile', async function (req, res, next) {
        if (poopyStarted) {
            var psfiles = globalData()['bot-data']['psfiles']
            res.redirect(psfiles[Math.floor(Math.random() * psfiles.length)])
        } else {
            res.sendFile(`${__dirname}/startpage/index.html`)
        }
    })

    app.use(function (req, res, next) {
        if (req.protocol !== 'https') return res.redirect(`https://${req.headers.host}${req.url}`)
    })

    app.use(express.static('public'))

    app.use(function (req, res, next) {
        res.status(404).sendFile(`${__dirname}/errorpages/404.html`)
    })

    app.listen(PORT, () => console.log('your balls are my property'))

    setInterval(function () {
        axios.get(`https://poopies-for-you.herokuapp.com`).catch(() => { })
    }, 300000)

    const tokens = [
        {
            TOKEN: process.env[__dirname.includes('app') ? 'POOPYTOKEN' : 'POOPYTOKEN2'],
            opts: {
                testing: !(__dirname.includes('app')),
                globalPrefix: __dirname.includes('app') ? 'p:' : '2p:',
            }
        }
    ]

    for (var i in tokens) {
        var tokendata = tokens[i]

        let poopy
        if (typeof tokendata == 'string') {
            poopy = new Poopy()
        } else {
            poopy = new Poopy(tokendata.opts)
        }

        await poopy.start(tokendata.TOKEN)
    }
    poopyStarted = true
}

main()