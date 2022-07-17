const fs = require('fs')
let createdFolders = []

fs.readdirSync('cmds').forEach(cmdName => {
    const cmdData = require(`./cmds/${cmdName}`)
    const category = cmdData.type.replace(/ /g, '_').toLowerCase()

    if (!createdFolders.includes(category)) {
        fs.mkdirSync(`cmds/${category}`)
        createdFolders.push(category)
    }

    fs.copyFileSync(`cmds/${cmdName}`, `cmds/${category}/${cmdName}`)
    fs.rmSync(`cmds/${cmdName}`)
})