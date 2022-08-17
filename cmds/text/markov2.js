module.exports = {
    name: ['markov2'],
    args: [{"name":"minlength","required":false,"specifarg":true},{"name":"randomsentences","required":false,"specifarg":true}],
    execute: async function (msg, args) {
        let poopy = this

        var minlength = poopy.functions.getOption(args, 'minlength', { dft: 5, splice: true, n: 1, join: true, func: (opt) => poopy.functions.parseNumber(opt, { dft: 5, min: 1, max: 10000, round: true }) })
        var randomsentences = poopy.functions.getOption(args, 'randomsentences', { dft: false, splice: true, n: 0, join: true })

        var messages = poopy.data['guild-data'][msg.guild.id]['messages'].slice().map(m => m.content)
        if (messages.length <= 0 || randomsentences) {
            messages = poopy.json.sentenceJSON.data.map(s => s.sentence).concat(poopy.arrays.psPasta)
        }
        await msg.channel.sendTyping().catch(() => { })

        var markov = poopy.functions.markov(messages, minlength)

        await msg.channel.send({
            content: markov,
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