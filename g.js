const dir = 'special/functions'

const fs = require('fs')

fs.readdirSync(dir).forEach(name => {
    const file = fs.readFileSync(`${dir}/${name}`).toString()

    if (file.includes('raw: true')) {
        console.log(name)
    }
})