module.exports = {
    name: ['generatetext', 'predicttext'],
    args: [{"name":"message","required":true,"specifarg":false,"orig":"<message>"},{"name":"temperature","required":false,"specifarg":true,"orig":"[-temperature <number (from 0 to 1)]"},{"name":"maxtokens","required":false,"specifarg":true,"orig":"[-maxtokens <number (max 512)>]"},{"name":"prespenalty","required":false,"specifarg":true,"orig":"[-(pres/count/freq)penalty <number (from 0 to 5/1/500)>]"},{"name":"countpenalty","required":false,"specifarg":true,"orig":"[-(pres/count/freq)penalty <number (from 0 to 5/1/500)>]"},{"name":"freqpenalty","required":false,"specifarg":true,"orig":"[-(pres/count/freq)penalty <number (from 0 to 5/1/500)>]"}],
    execute: async function (msg, args) {
        let poopy = this

        await msg.channel.sendTyping().catch(() => { })

        var temperature = poopy.functions.getOption(args, 'temperature', { dft: 0.6, splice: true, n: 1, join: true, func: (opt) => poopy.functions.parseNumber(opt, { dft: 0.6, min: 0, max: 1, round: false }) })
        var maxtokens = poopy.functions.getOption(args, 'maxtokens', { dft: 65, splice: true, n: 1, join: true, func: (opt) => poopy.functions.parseNumber(opt, { dft: 65, min: 1, max: 512, round: true }) })
        var pres = poopy.functions.getOption(args, 'prespenalty', { dft: 1, splice: true, n: 1, join: true, func: (opt) => poopy.functions.parseNumber(opt, { dft: 1, min: 0, max: 5, round: false }) })
        var count = poopy.functions.getOption(args, 'countpenalty', { dft: 0, splice: true, n: 1, join: true, func: (opt) => poopy.functions.parseNumber(opt, { dft: 0, min: 0, max: 1, round: false }) })
        var freq = poopy.functions.getOption(args, 'freqpenalty', { dft: 0, splice: true, n: 1, join: true, func: (opt) => poopy.functions.parseNumber(opt, { dft: 0, min: 0, max: 500, round: true }) })
        var saidMessage = args.slice(1).join(' ')
        if (args[1] === undefined) {
            await msg.channel.send('What is the text to generate?!').catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return
        }

        var models = ['j1-jumbo', 'j1-grande', 'j1-large']

        for (var model of models) {
            var resp = await poopy.modules.axios.request({
                url: `https://api.ai21.com/studio/v1/${model}/complete`,
                method: 'POST',
                data: {
                    prompt: saidMessage,
                    numResults: 1,
                    maxTokens: maxtokens,
                    temperature: temperature,
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
            }).catch(() => { })

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
                return
            }
        }
        
        if (poopy.vars.validUrl.test(saidMessage)) {
            await msg.channel.send('URLs in this command will break it.').catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return
        }
        
        var resp = await poopy.modules.deepai.callStandardApi("text-generator", {
            text: saidMessage,
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
                content: resp.output,
                allowedMentions: {
                    parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                }
            }).catch(() => { })
        }
    },
    help: {
        name: 'generatetext/predicttext <message> [-temperature <number (from 0 to 1)] [-maxtokens <number (max 512)>] [-(pres/count/freq)penalty <number (from 0 to 5/1/500)>]',
        value: 'Tries to predict subsequent text from the specified message with AI21, DeepAI otherwise. Default max tokens are 65 and temperature is 0.6.'
    },
    type: 'Generation',
    envRequired: ['AI21KEY', 'DEEPAIKEY']
}