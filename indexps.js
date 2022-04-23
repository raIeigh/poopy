const Poopy = require('./poopy')

var tokens = [
    {
        TOKEN: process.env[__dirname.includes('app') ? 'POOSONIATOKEN' : 'POOPYTOKEN2'],
        opts: {
            testing: !(__dirname.includes('app')),
            poosonia: true,
            mongodatabase: 'poopypsdata'
        }
    }
]

tokens.forEach(async tokendata => {
    if (typeof tokendata == 'string') {
        Poopy(tokendata)
    } else {
        Poopy(tokendata.TOKEN, tokendata.opts)
    }
})
