const Poopy = require('./modules/poopy')
const tokens = [
    {
        TOKEN: process.env[__dirname.includes('app') ? 'POOPYTOKEN' : 'POOPYTOKEN2'],
        opts: {
            testing: !(__dirname.includes('app'))
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