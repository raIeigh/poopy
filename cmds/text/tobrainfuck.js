module.exports = {
    name: ['tobrainfuck', 'tobf'],
    args: [{"name":"message","required":true,"specifarg":false,"orig":"<message>"}],
    execute: async function (msg, args) {
        let poopy = this
        let { tobrainfuck } = poopy.functions
        let vars = poopy.vars
        let config = poopy.config
        let modules = poopy.modules

        await msg.channel.sendTyping().catch(() => { })
        var saidMessage = args.slice(1).join(' ')
        if (args[1] === undefined) {
            await msg.reply('What is the message to convert?!').catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        };
        await msg.reply({
            content: tobrainfuck(saidMessage),
            allowedMentions: {
                parse: ((!msg.member.permissihas('ADMINISTRATOR') && !msg.member.permissihas('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
            }
        }).catch(async () => {
            var currentcount = vars.filecount
            vars.filecount++
            var filepath = `temp/${config.mongodatabase}/file${currentcount}`
            modules.fs.mkdirSync(`${filepath}`)
            modules.fs.writeFileSync(`${filepath}/tobrainfuck.txt`, tobrainfuck(saidMessage))
            await msg.reply({
                files: [new modules.Discord.MessageAttachment(`${filepath}/tobrainfuck.txt`)]
            }).catch(() => { })
            modules.fs.rmSync(`${filepath}`, { force: true, recursive: true })
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