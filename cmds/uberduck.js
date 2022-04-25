module.exports = {
    name: ['uberduck', 'tts'],
    execute: async function (msg, args) {
        let poopy = this

        msg.channel.sendTyping().catch(() => { })
        if (args[1] === undefined) {
            msg.channel.send('What is the voice?! A list can be found at https://uberduck.ai/quack-help').catch(() => { })
            msg.channel.sendTyping().catch(() => { })
            return;
        }
        if (args[2] === undefined) {
            msg.channel.send('What is the text?!').catch(() => { })
            msg.channel.sendTyping().catch(() => { })
            return;
        }

        var saidVoice = args[1]
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
            err.response.data = JSON.parse(err.response.data)
            return err.response
        })

        if (rejected && response.data.detail) {
            msg.channel.send(response.data.detail).catch(() => { })
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