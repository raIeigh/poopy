const Poopy = require('./poopy')
const tokens = [
    {
        TOKEN: process.env[__dirname.includes('app') ? 'POOPYTOKEN' : 'RACIST'],
        opts: {
            testing: !(__dirname.includes('app')),
            prefix: __dirname.includes('app') ? 'p:' : '2p:'
        }
    }
]

tokens.forEach(async tokendata => {
    let poopy
    if (typeof tokendata == 'string') {
        poopy = new Poopy()
    } else {
        poopy = new Poopy(tokendata.opts)
    }
    poopy.start(tokendata.TOKEN)
})