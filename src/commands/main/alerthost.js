let globalId = 1

module.exports = {
    name: ['alerthost'],
    args: [{
        "name": "text",
        "required": true,
        "specifarg": false,
        "orig": "<text>",
    }],
    execute: async function (msg, args) {
        let poopy = this
        let { execPromise } = poopy.functions
        let { fs } = poopy.modules

        if (args[1] === undefined) {
            if (!msg.nosend) msg.reply('What is the text to show?!')
            return ''
        }
        
        var saidMessage = args.slice(1).join(' ')
        saidMessage = saidMessage.match(/[^"]+/g)[0].replace(/\n/g, '\\n')

        var thisFileName = 'temp' + globalId + '.vbs'
        globalId++

        fs.writeFileSync(`./temp/${thisFileName}`, `x=MsgBox("${saidMessage}", 4144, "Bot Message")`)
        execPromise(`wscript ./temp/${thisFileName}`).then(() => {
            fs.unlinkSync(`./temp/${thisFileName}`)
        })

        if (!msg.nosend) msg.reply('Success.')

        return ''
    },
    help: {
        name: 'alerthost <text>',
        value: "Alert's the bot's host machine with your message."
    },
    cooldown: 30000,
    type: 'Main'
}