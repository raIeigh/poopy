module.exports = {
    name: ['generatetext', 'predicttext'],
    execute: async function (msg, args) {
        let poopy = this

        await msg.channel.sendTyping().catch(() => { })

        var maxtokens = poopy.functions.getOption(args, 'maxtokens', { dft: 65, splice: true, n: 1, join: true, func: (opt) => poopy.functions.parseNumber(opt, { dft: 65, min: 1, max: 2048, round: true }) })
        var pres = poopy.functions.getOption(args, 'prespenalty', { dft: 0, splice: true, n: 1, join: true, func: (opt) => poopy.functions.parseNumber(opt, { dft: 0, min: 0, max: 5, round: false }) })
        var count = poopy.functions.getOption(args, 'countpenalty', { dft: 0, splice: true, n: 1, join: true, func: (opt) => poopy.functions.parseNumber(opt, { dft: 0, min: 0, max: 1, round: false }) })
        var freq = poopy.functions.getOption(args, 'freqpenalty', { dft: 0, splice: true, n: 1, join: true, func: (opt) => poopy.functions.parseNumber(opt, { dft: 0, min: 0, max: 500, round: true }) })
        var saidMessage = args.slice(1).join(' ')
        if (args[1] === undefined) {
            await msg.channel.send('What is the text to generate?!').catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return
        }

        var resp = await poopy.modules.axios.request({
            url: 'https://api.ai21.com/studio/v1/j1-jumbo/complete',
            method: 'POST',
            data: {
                prompt: saidMessage,
                numResults: 1,
                maxTokens: maxtokens,
                temperature: 0.6,
                topKReturn: 0,
                topP: 1,
                presencePenalty: {
                    scale: pres,
                    applyToNumbers: false,
                    applyToPunctuations: false,
                    applyToStopwords: false,
                    applyToWhitespaces: false,
                    applyToEmojis: false
                },
                countPenalty: {
                    scale: count,
                    applyToNumbers: false,
                    applyToPunctuations: false,
                    applyToStopwords: false,
                    applyToWhitespaces: false,
                    applyToEmojis: false
                },
                frequencyPenalty: {
                    scale: freq,
                    applyToNumbers: false,
                    applyToPunctuations: false,
                    applyToStopwords: false,
                    applyToWhitespaces: false,
                    applyToEmojis: false
                },
                stopSequences: []
            },
            headers: {
                Authorization: `Bearer ${process.env.AI21KEY}`
            }
        }).catch(async err => {
            await msg.channel.send({
                content: err.stack,
                allowedMentions: {
                    parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                }
            }).catch(() => { })
        })

        if (resp) {
            await msg.channel.send({
                content: `${saidMessage}${resp.data.completions[0].data.text}`,
                allowedMentions: {
                    parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                }
            }).catch(async () => {
                var currentcount = poopy.vars.filecount
                poopy.vars.filecount++
                var filepath = `temp/${poopy.config.mongodatabase}/file${currentcount}`
                poopy.modules.fs.mkdirSync(`${filepath}`)
                poopy.modules.fs.writeFileSync(`${filepath}/generated.txt`, `${saidMessage}${resp.data.completions[0].data.text}`)
                await msg.channel.send({
                    files: [new poopy.modules.Discord.MessageAttachment(`${filepath}/generated.txt`)]
                }).catch(() => { })
                poopy.modules.fs.rmSync(`${filepath}`, { force: true, recursive: true })
            })
        }
        await msg.channel.sendTyping().catch(() => { })
    },
    help: {
        name: 'generatetext/predicttext <message> [-maxtokens <number (max 2048)>] [-(pres/count/freq)penalty <number (max 5/1/500)>]',
        value: 'Tries to predict subsequent text from the specified message with AI21. Default max tokens are 65.'
    },
    type: 'Text',
    envRequired: ['AI21KEY']
}