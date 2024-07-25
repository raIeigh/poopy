module.exports = {
    name: ['vocals'],
    args: [],
    execute: async function (msg) {
        let poopy = this
        let { sendFile } = poopy.functions
        let { Discord } = poopy.modules
        
        await msg.channel.sendTyping().catch(() => { })
        var attachment = new Discord.AttachmentBuilder('assets/audio/angryluigivocals.ogg')
        if (msg.nosend) return await sendFile(msg, 'assets/audio', 'angryluigivocals.ogg', { keep: true })
        
        await msg.reply({
            files: [attachment]
        }).catch(() => { })
        
        return ''
    },
    help: {
        name: 'vocals',
        value: 'Get the Angry Luigi vocals.'
    },
    cooldown: 0,
    type: 'Angry Luigi'
}
