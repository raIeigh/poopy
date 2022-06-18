const dir = 'cmds'
const fs = require('fs')

fs.readdirSync(dir).forEach(name => {
    var file = fs.readFileSync(`${dir}/${name}`).toString()
    
    if (file.includes('role => role.name')) console.log(name)
})