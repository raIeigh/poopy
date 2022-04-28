const Poopy = require('./poopy')
const tokens = [
    {
        TOKEN: process.env[__dirname.includes('app') ? 'POOSONIATOKEN' : 'POOPYTOKEN2'],
        opts: {
            testing: !(__dirname.includes('app')),
            poosonia: true,
            mongodatabase: 'poopypsdata',
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