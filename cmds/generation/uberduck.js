module.exports = {
    name: ['uberduck', 'tts'],
    args: [{
        "name": "voice", "required": true, "specifarg": false, "orig": "<voice>", "autocomplete": function () {
            let poopy = this

            return poopy.vars.ubervoices.map(voice => {
                return { name: voice.display_name.trim(), value: voice.name }
            })
        }
    }, { "name": "text", "required": true, "specifarg": false, "orig": "<text>" }],
    execute: async function (msg, args) {
        let poopy = this
        let vars = poopy.vars
        let modules = poopy.modules
        let { downloadFile, sendFile } = poopy.functions

        await msg.channel.sendTyping().catch(() => { })

        if (args[1] === undefined) {
            await msg.reply(`What is the voice?! A list can be found at ${process.env.BOTWEBSITE ? `${process.env.BOTWEBSITE}/ubervoices` : `https://app.uberduck.ai/quack-help`}`).catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        }

        if (!vars.ubervoices.find(vc => vc.name == args[1].toLowerCase())) {
            await msg.reply(`Invalid voice. A list can be found at ${process.env.BOTWEBSITE ? `${process.env.BOTWEBSITE}/ubervoices` : `https://app.uberduck.ai/quack-help`}`).catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return
        }

        if (args[2] === undefined) {
            await msg.reply('What is the text?!').catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        }

        var saidVoice = args[1].toLowerCase()
        var saidMessage = args.slice(2).join(' ').replace(/'/g, '’').replace(/"/g, '\\"')

        var rejected = false
        var response = await modules.axios.request({
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
            await msg.reply({
                content: response.data,
                allowedMentions: {
                    parse: (!msg.member.permissihas('ADMINISTRATOR') &&
                        !msg.member.permissihas('MENTION_EVERYONE') &&
                        msg.member.id !== msg.guild.ownerID) ?
                        ['users'] : ['users', 'everyone', 'roles']
                }
            }).catch(() => { })
            return;
        }

        var filepath = await downloadFile(response.data, `output.wav`, {
            buffer: true
        })
        return await sendFile(msg, filepath, `output.wav`)
    },
    help: {
        name: 'uberduck/tts <voice> <text>',
        value: `Generates a TTS synthesized speech with Uberduck AI. A list of voices can be found at ${process.env.BOTWEBSITE ? `${process.env.BOTWEBSITE}/ubervoices` : `https://app.uberduck.ai/quack-help`}. Try it yourself at https://app.uberduck.ai/speak#mode=tts-basic`
    },
    type: 'Generation',
    envRequired: ['UBERDUCKKEY', 'UBERDUCKSECRET']
}