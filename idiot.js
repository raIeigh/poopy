const fs = require('fs')
const poopyRegex = /mentimembers/g

fs.readdirSync('cmds').forEach(cat => {
    fs.readdirSync(`cmds/${cat}`).forEach(cmn => {
        let cmd = fs.readFileSync(`cmds/${cat}/${cmn}`).toString()
        let cmdData = require(`./cmds/${cat}/${cmn}`)
        let execute = cmdData.execute.toString()
        let spacing = execute.split('\n')[1].match(/^ */)

        let matches = cmd.match(poopyRegex)

        if (matches) {
            //matches = matches.map(m => m.substring(8, m.length - 1)).filter((lang, index, self) => self.findIndex(l => l === lang) === index)
            let newexe = execute.replace(poopyRegex, 'mentions.members').split('\n')
            //let lepoopy = newexe.findIndex(g => g.includes('let modules = poopy.modules'))
            
            //newexe[lepoopy] = `${spacing}let { ${matches.join(', ')} } = poopy.modules`
            //console.log(newexe)
            fs.writeFileSync(`cmds/${cat}/${cmn}`, cmd.replace(execute, newexe.join('\n')))
        }
    })
})