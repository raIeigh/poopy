module.exports = {
    name: ['uberduck', 'tts'],
    execute: async function (msg, args) {
        let poopy = this

        await msg.channel.sendTyping().catch(() => { })

        if (args[1] === undefined) {
            await msg.channel.send('What is the voice?! A list can be found at https://poopies-for-you.herokuapp.com/ubervoices').catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        }

        if (!poopy.vars.ubervoices.find(vc => vc.name == args[1].toLowerCase())) {
            await msg.channel.send('Invalid voice. A list can be found at https://poopies-for-you.herokuapp.com/ubervoices').catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return
        }

        if (args[2] === undefined) {
            await msg.channel.send('What is the text?!').catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        }

        var saidVoice = args[1].toLowerCase()
        var saidMessage = args.join(' ').substring(args[0].length + args[1].length + 2).replace(/'/g, '’').replace(/"/g, '\\"')

        var rejected = false
        var response = await poopy.modules.axios.request({
            method: 'POST',
            url: 'https://api.uberduck.ai/speak-synchronous',
            headers: {
                Accept: 'audio/wav',
                Authorization: `Basic ${btoa(`${process.env.UBERDUCKKEY}:${process.env.UBERDUCKSECRET}`)}`,
                'Content-Type': 'application/json'
            },
            data: {
                voice: saidVoice,
                speech: saidMessage
            },
            responseType: 'arraybuffer'
        }).catch((err) => {
            rejected = true
            try {
                err.response.data = JSON.parse(err.response.data).detail
            } catch (_) {
                err.response.data = err.response.data.toString()
            }
            return err.response
        })

        if (rejected && response.data) {
            await msg.channel.send({
                content: response.data,
                allowedMentions: {
                    parse: (!msg.member.permissions.has('ADMINISTRATOR') &&
                        !msg.member.permissions.has('MENTION_EVERYONE') &&
                        msg.member.id !== msg.guild.ownerID) ?
                        ['users'] : ['users', 'everyone', 'roles']
                }
            }).catch(() => { })
            return;
        }

        var filepath = await poopy.functions.downloadFile(response.data, `output.mp3`, {
            buffer: true,
            convert: true
        })
        await poopy.functions.sendFile(msg, filepath, `output.mp3`)
    },
    help: {
        name: 'uberduck/tts <voice> <text>',
        value: 'Generates a TTS synthesized speech with Uberduck AI. A list of voices can be found at https://uberduck.ai/quack-help'
    },
    type: 'Generation'
}