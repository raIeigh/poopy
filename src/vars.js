const { catbox, google } = require('./modules')

let vars = {}

vars.validUrl = /https?:\/\/([!#$&-;=?-[\]_a-z~]|%[0-9a-fA-F]{2})+/
vars.emojiRegex = require('emoji-regex')()
vars.Catbox = new catbox.Catbox()
vars.Litterbox = new catbox.Litterbox()
if (process.env.GOOGLE_KEY) vars.youtube = google.youtube({
    version: 'v3',
    auth: process.env.GOOGLE_KEY
})
/*if (process.env.TWITTER_CONSUMER_KEY && process.env.TWITTER_CONSUMER_SECRET && process.env.TWITTER_ACCESSTOKEN_KEY && process.env.TWITTER_ACCESSTOKEN_SECRET) vars.twitterClient = new Twitter({
    consumer_key: process.env.TWITTERCONSUMERKEY,
    consumer_secret: process.env.TWITTERCONSUMERSECRET,
    access_token_key: process.env.TWITTERACCESSTOKENKEY,
    access_token_secret: process.env.TWITTERACCESSTOKENSECRET
})*/
vars.gifFormats = ['gif', 'apng']
vars.jimpFormats = ['png', 'jpeg', 'jpg', 'gif', 'bmp', 'tiff']
vars.processingTools = require('./processingTools')
vars.symbolreplacements = [{
    target: ['‘',
        '’',
        '‛',
        '❛',
        '❜'],
    replacement: '\''
},
    {
        target: ['“',
            '”',
            '‟'],
        replacement: '"'
    }]
vars.punctuation = ['?', '.', '!', '...']
vars.caseModifiers = [
    function (text) {
        return text.toUpperCase()
    },
    function (text) {
        return text.toLowerCase()
    },
    function (text) {
        return text.toUpperCase().substring(0, 1) + text.toLowerCase().substring(1)
    }
]
vars.clevercontexts = {}

module.exports = vars