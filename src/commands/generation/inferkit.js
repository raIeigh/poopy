module.exports = {
    name: ['inferkit', 'transformer'],
    args: [{ "name": "message", "required": true, "specifarg": false, "orig": "<message>" }, { "name": "temperature", "required": false, "specifarg": true, "orig": "[-temperature <number (from 0.1 to 2)>]" }, { "name": "topp", "required": false, "specifarg": true, "orig": "[-topp <number (from 0 to 1)>]" }, { "name": "keywords", "required": false, "specifarg": true, "orig": "[-keywords <words (separated by spaces)>]" }],
    execute: async function (msg, args) {
        let poopy = this
        let { getOption, parseNumber } = poopy.functions
        let { axios, fs, Discord } = poopy.modules
        let vars = poopy.vars
        let config = poopy.config

        await msg.channel.sendTyping().catch(() => { })

        var temperature = getOption(args, 'temperature', { dft: 1, splice: true, n: 1, join: true, func: (opt) => parseNumber(opt, { dft: 1, min: 0.1, max: 2, round: false }) })
        var topP = getOption(args, 'topp', { dft: 0.9, splice: true, n: 1, join: true, func: (opt) => parseNumber(opt, { dft: 0.9, min: 0, max: 1, round: false }) })
        var keywords = getOption(args, 'keywords', { dft: [], splice: true, n: Infinity, join: false, stopMatch: ['-temperature', '-topp'] }).slice(0, 10)

        var saidMessage = args.slice(1).join(' ')
        if (args[1] === undefined) {
            await msg.reply('What is the text to generate?!').catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return
        }

        var resp = await axios({
            url: 'https://api.inferkit.com/v1/models/standard/generate?useDemoCredits=true',
            method: 'POST',
            data: {
                "streamResponse": true,
                "prompt": {
                    "text": saidMessage,
                    "isContinuation": false
                },
                "startFromBeginning": false,
                "length": 200,
                "forceNoEnd": true,
                "topP": topP,
                "temperature": temperature,
                "keywords": keywords
            }
        }).catch(async () => {
            await msg.reply('Error.').catch(() => { })
        })

        if (!resp) return

        var chunks = resp.data.trim().split('\n').map(chunk => JSON.parse(chunk))

        if (!msg.nosend) await msg.reply({
            content: `${saidMessage}${chunks.map(chunk => chunk.data.text).join('')}`,
            allowedMentions: {
                parse: ((!msg.member.permissions.has('Administrator') && !msg.member.permissions.has('MentionEveryone') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
            }
        }).catch(async () => {
            var currentcount = vars.filecount
            vars.filecount++
            var filepath = `temp/${config.database}/file${currentcount}`
            fs.mkdirSync(`${filepath}`)
            fs.writeFileSync(`${filepath}/generated.txt`, `${saidMessage}${resp.data.completions[0].data.text}`)
            await msg.reply({
                files: [new Discord.AttachmentBuilder(`${filepath}/generated.txt`)]
            }).catch(() => { })
            fs.rmSync(`${filepath}`, { force: true, recursive: true })
        })
        return `${saidMessage}${chunks.map(chunk => chunk.data.text).join('')}`
    },
    help: {
        name: 'inferkit/transformer <message> [-temperature <number (from 0.1 to 2)>] [-topp <number (from 0 to 1)>] [-keywords <words (separated by spaces)>]',
        value: 'Tries to predict subsequent text from the specified message with InferKit. Has a weekly character limit of 10000, but resets every shutdown. Default temperature is 1 and Top P is 0.9.'
    },
    type: 'Generation'
}