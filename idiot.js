const fs = require('fs')
const poopyRegex = /keys\.[a-zA-Z0-9_]+(\.|\[|\()/g

//fs.readdirSync('special').forEach(cat => {
    //fs.readdirSync(`special/${cat}`).forEach(cmn => {
        let cmd = fs.readFileSync(`modules/sayorimessagegenerator.js`).toString()
        //let cmdData = require(`./modules/sayorimessagegenerator`)
        //let execute = cmdData.func.toString()
        let spacing = cmd.split('\n')[1].match(/^ */)

        let matches = cmd.match(poopyRegex)

        if (matches) {
            matches = matches.map(m => m.substring(5, m.length - 1)).filter((lang, index, self) => self.findIndex(l => l === lang) === index)
            let newexe = cmd.replace(poopyRegex, s => s.substring(5, s.length - 1)).split('\n')
            let lepoopy = newexe.findIndex(g => g.includes('let keys = poopy.special.keys'))
            
            newexe[lepoopy] = `${spacing}let { ${matches.join(', ')} } = poopy.special.keys`
            console.log(newexe[lepoopy])
            //fs.writeFileSync(`cmds/${cat}/${cmn}`, cmd.replace(execute, newexe.join('\n')))
        }
    //})
//})