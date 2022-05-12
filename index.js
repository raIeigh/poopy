async function main() {
    let poopyStarted = false
    const express = require('express')
    const https = require('https')
    const http = require('http');
    const fs = require('fs-extra')
    const axios = require('axios')
    const cors = require('cors')
    let globalData = require('./modules/globalData')

    const PORT = process.env.PORT || 8080
    const app = express()

    app.use(cors())

    app.use(function (req, res, next) {
        const isNotSecure = (!req.get('x-forwarded-port') && req.protocol !== 'https') ||
            parseInt(req.get('x-forwarded-port'), 10) !== 443 &&
            (parseInt(req.get('x-forwarded-port'), 10) === parseInt(req.get('x-forwarded-port'), 10))

        if (isNotSecure) {
            return res.redirect(301, `https://${req.get('host')}${req.url}`)
        }

        next()
    })

    app.get('/api/poopystarted', async function (req, res, next) {
        res.type('json').send({
            started: poopyStarted
        })
    })

    app.get('/api/globaldata', async function (req, res, next) {
        res.type('json').send(globalData())
    })

    app.get('/psfile', async function (req, res, next) {
        if (poopyStarted) {
            const psfiles = globalData()['bot-data']['psfiles']
            res.redirect(psfiles[Math.floor(Math.random() * psfiles.length)])
        } else {
            res.sendFile(`${__dirname}/https/startpage.html`)
        }
    })

    app.use(express.static('https/public'))

    app.use(function (req, res, next) {
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
            opts: {
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
            poopy = new Poopy(tokendata.opts)
        }

        await poopy.start(tokendata.TOKEN)
    }
    poopyStarted = true
}

main()