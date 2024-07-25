module.exports = {
    name: ['angryluigiimage'],
    args: [],
    execute: async function (msg) {
        let poopy = this
        let { sendFile } = poopy.functions
        let { Discord } = poopy.modules

        await msg.channel.sendTyping().catch(() => { })
        var attachment = new Discord.AttachmentBuilder('assets/image/angryluigi.png')
        if (msg.nosend) return await sendFile(msg, 'assets/image', 'angryluigi.png', { keep: true })

        await msg.reply({
            files: [attachment]
        }).catch(() => { })

        return ''
    },
    help: {
        name: 'angryluigiimage',
        value: 'Get the Angry Luigi image.'
    },
    cooldown: 0,
    type: 'Angry Luigi'
}
