module.exports = {
    name: ['tobrainfuck', 'tobf'],
    args: [{"name":"message","required":true,"specifarg":false,"orig":"<message>"}],
    execute: async function (msg, args) {
        let poopy = this

        await msg.channel.sendTyping().catch(() => { })
        var saidMessage = args.slice(1).join(' ')
        if (args[1] === undefined) {
            await msg.reply('What is the message to convert?!').catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        };
        await msg.reply({
            content: poopy.functions.tobrainfuck(saidMessage),
            allowedMentions: {
                parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
            }
        }).catch(async () => {
            var currentcount = poopy.vars.filecount
            poopy.vars.filecount++
            var filepath = `temp/${poopy.config.mongodatabase}/file${currentcount}`
            poopy.modules.fs.mkdirSync(`${filepath}`)
            poopy.modules.fs.writeFileSync(`${filepath}/tobrainfuck.txt`, poopy.functions.tobrainfuck(saidMessage))
            await msg.reply({
                files: [new poopy.modules.Discord.MessageAttachment(`${filepath}/tobrainfuck.txt`)]
            }).catch(() => { })
            poopy.modules.fs.rmSync(`${filepath}`, { force: true, recursive: true })
        })
        await msg.channel.sendTyping().catch(() => { })
    },
    help: {
        name: 'tobrainfuck/tobf <message>',
        value: 'Converts the message into Brainfuck.'
    },
    cooldown: 2500,
    type: 'Text'
}