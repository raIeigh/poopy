module.exports = {
    name: ['burningtext', 'flamingtext'],
    execute: async function (msg, args) {
        let poopy = this

        await msg.channel.sendTyping().catch(() => { })
        var saidMessage = args.join(' ').substring(args[0].length + 1)
        if (args[1] === undefined) {
            await msg.channel.send('What is the text?!').catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        }

        var response = await poopy.functions.request({
            url: 'http://cooltext.com/PostChange',
            method: 'POST',
            formData: {
                LogoID: 4,
                Text: saidMessage,
                FontSize: 70,
                Color1_color: '#FF0000',
                Integer1: 15,
                Boolean1: 'on',
                Integer9: 0,
                Integer13: 'on',
                Integer12: 'on',
                BackgroundColor_color: '#FFFFFF',
            }
        }).catch(async () => {
            await msg.channel.send('Error creating text.').catch(() => { })
        })

        if (!response) return

        await msg.channel.send({
            files: [new poopy.modules.Discord.MessageAttachment(response.data.renderLocation.replace('https', 'http'))]
        }).catch(async () => {
            await msg.channel.send(response.data.renderLocation.replace('https', 'http')).catch(() => { })
        })
    },
    help: {
        name: '<:newpoopy:839191885310066729> burningtext/flamingtext <prompt>',
        value: 'i love metallica!!!!!! Try it yourself at https://cooltext.com/Logo-Design-Burning'
    },
    cooldown: 2500,
    type: 'Generation'
}