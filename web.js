const express = require('express')
const cors = require('cors')
const app = express()

const PORT = process.env.PORT || 8080

app.use(cors())

app.use(express.static(__dirname + '/public'))

app.use(function (req, res) {
    res.redirect(`https://${req.headers.host}${req.url}`)
    res.status(400).sendFile(__dirname + '/errorpages/400.html')
    res.status(401).sendFile(__dirname + '/errorpages/401.html')
    res.status(403).sendFile(__dirname + '/errorpages/403.html')
    res.status(404).sendFile(__dirname + '/errorpages/404.html')
    res.status(500).sendFile(__dirname + '/errorpages/504.html')
})

app.get('/', function (req, res) {
    res.setHeader({
        "Report-To": `{"group":"csp-endpoint","max_age":10886400,"endpoints":[{"url":"http://${req.socket.remoteAddress}:5500/__cspreport__"}],"include_subdomains":true}`,
        "Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' 'nonce-MTYxLDExNSw3MiwyMTQsMTgsMzIsNTcsNjM=' https://cdn.discordapp.com/animations/ https://www.gstatic.com/recaptcha/ https://www.google.com/recaptcha/ https://recaptcha.net/recaptcha/ https://*.hcaptcha.com https://hcaptcha.com https://js.stripe.com https://js.braintreegateway.com https://assets.braintreegateway.com https://www.paypalobjects.com https://checkout.paypal.com; style-src 'self' 'unsafe-inline' https://cdn.discordapp.com https://*.hcaptcha.com https://hcaptcha.com; img-src 'self' blob: data: https://*.discordapp.net https://*.discordapp.com https://*.discord.com https://i.scdn.co https://i.ytimg.com https://i.imgur.com https://*.gyfcat.com https://media.tenor.co https://media.tenor.com https://c.tenor.com https://*.youtube.com https://*.giphy.com https://static-cdn.jtvnw.net https://pbs.twimg.com https://assets.braintreegateway.com https://checkout.paypal.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://status.discordapp.com https://status.discord.com https://support.discordapp.com https://support.discord.com https://discordapp.com https://discord.com https://cdn.discordapp.com https://media.discordapp.net https://router.discordapp.net wss://*.discord.gg https://best.discord.media https://latency.discord.media wss://*.discord.media wss://dealer.spotify.com https://api.spotify.com https://sentry.io https://api.twitch.tv https://api.stripe.com https://api.braintreegateway.com https://client-analytics.braintreegateway.com https://origin-analytics-prod.production.braintree-api.com https://payments.braintree-api.com https://www.googleapis.com https://*.algolianet.com https://*.hcaptcha.com https://hcaptcha.com https://*.algolia.net ws://127.0.0.1:* http://127.0.0.1:*; media-src 'self' blob: https://*.discordapp.net https://*.discord.com https://*.discordapp.com https://*.youtube.com https://streamable.com https://vid.me https://*.gfycat.com https://twitter.com https://oddshot.akamaized.net https://*.giphy.com https://i.imgur.com https://media.tenor.co https://media.tenor.com https://c.tenor.com; frame-src https://discordapp.com/domain-migration discord: https://www.google.com/recaptcha/ https://recaptcha.net/recaptcha/ https://*.hcaptcha.com https://hcaptcha.com https://js.stripe.com https://hooks.stripe.com https://checkout.paypal.com https://assets.braintreegateway.com https://player.twitch.tv https://clips.twitch.tv/embed https://www.youtube.com/embed/ https://twitter.com/i/videos/ https://www.funimation.com/player/ https://open.spotify.com/embed/ https://w.soundcloud.com/player/ https://audius.co/embed/ https://*.watchanimeattheoffice.com https://localhost:* https://*.discordsays.com; child-src 'self' https://assets.braintreegateway.com https://checkout.paypal.com;"
    });
    res.render('index');
})

app.listen(PORT, () => console.log('your balls are my property'))