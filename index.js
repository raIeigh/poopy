const Poopy = require('./poopy')

var tokens = [
    {
        TOKEN: process.env[__dirname.includes('app') ? 'POOPYTOKEN' : 'POOPYTOKEN2'],
        opts: {
            testing: !(__dirname.includes('app'))
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
