module.exports = {
    name: ['markov2'],
    execute: async function (msg, args) {
        let poopy = this

        var wordNumber = poopy.functions.getOption(args, 'words', { dft: Math.floor(Math.random() * 20) + 1, splice: true, n: 1, join: true, func: (opt) => poopy.functions.parseNumber(opt, { dft: Math.floor(Math.random() * 20) + 1, min: 1, max: 10000, round: true }) })
        var nopunctuation = poopy.functions.getOption(args, 'nopunctuation', { dft: false, splice: true, n: 0, join: true })
        var keepcase = poopy.functions.getOption(args, 'keepcase', { dft: false, splice: true, n: 0, join: true })
        var randlerp = poopy.functions.getOption(args, 'randlerp', { dft: 0.4, splice: true, n: 1, join: true })
        var randomsentences = poopy.functions.getOption(args, 'randomsentences', { dft: false, splice: true, n: 0, join: true })

        var messages = poopy.data['guild-data'][msg.guild.id]['messages'].slice().map(m => m.content)
        if (messages.length <= 0 || randomsentences) {
            messages = poopy.json.sentenceJSON.data.map(s => s.sentence).concat(poopy.arrays.psPasta)
        }
        await msg.channel.sendTyping().catch(() => { })

        await msg.channel.send({
            content: poopy.functions.markov(messages),
            allowedMentions: {
                parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
            }
        }).catch(async () => {
            var currentcount = poopy.vars.filecount
            poopy.vars.filecount++
            var filepath = `temp/${poopy.config.mongodatabase}/file${currentcount}`
            poopy.modules.fs.mkdirSync(`${filepath}`)
            poopy.modules.fs.writeFileSync(`${filepath}/markov.txt`, markov)
            await msg.channel.send({
                files: [new poopy.modules.Discord.MessageAttachment(`${filepath}/markov.txt`)]
            }).catch(() => { })
            poopy.modules.fs.rmSync(`${filepath}`, { force: true, recursive: true })
        })
    },
    help: {
        name: 'markov2 [-minlength <wordNumber>] [-randomsentences]',
        value: 'the Poopy Markov includes last messages. this use different algorith.'
    },
    cooldown: 2500,
    type: 'Text'
}