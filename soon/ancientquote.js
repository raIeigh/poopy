module.exports = {
    name: ['ancientquote'],
    execute: async function (msg, args) {
        let poopy = this

        await msg.channel.sendTyping().catch(() => { })
        var saidMessage = args.join(' ').substring(args[0].length + 1)
        if (args[1] === undefined) {
            await msg.channel.send('What is the text?!').catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        }

        var intromakerresponse = await poopy.modules.axios.get('https://intromaker.com/intro/408/ancient-quote/editor').catch(async () => {
            await msg.channel.send('Error generating video.').catch(() => { })
        })

        if (!intromakerresponse) return

        console.log(intromakerresponse)

        var cookies = intromakerresponse.headers['set-cookie'].map(cookie => cookie.split(';')[0]).join('; ')
        var tokenMatch = [`<input type="hidden" name="_token" value="`, `">`]
        var token = intromakerresponse.data.match(new RegExp(`${poopy.functions.regexClean(tokenMatch[0])}.+${poopy.functions.regexClean(tokenMatch[1])}`))[0]
        token = token.substring(tokenMatch[0].length, token.length - tokenMatch[1].length)

        var response = await poopy.functions.request({
            url: 'https://intromaker.com/render',
            method: 'POST',
            formData: {
                _token: token,
                templateId: 408,
                IC_EDIT_TEXTAREA_01: saidMessage,
                replaceAudio: 'original',
                libraryAudio: '30-seconds-of-christmas-dream_fy9FyBVd.mp3',
                uploadAudio: {
                    value: Buffer.from(''),
                    options: { filename: '', contentType: 'application/octet-stream' }
                }
            },
            headers: {
                'content-type': 'multipart/form-data; boundary=----WebKitFormBoundaryjpCPuuBx600e5htA',
                cookie: cookies
            }
        }).catch(async () => {
            await msg.channel.send('Error generating video.').catch(() => { })
        })

        if (!response) return

        /*await msg.channel.send({
            files: [new poopy.modules.Discord.MessageAttachment(response.data.renderLocation)]
        }).catch(async () => {
            await msg.channel.send(response.data.renderLocation).catch(() => { })
        })*/
    },
    help: {
        name: '<:newpoopy:839191885310066729> ancientquote <prompt>',
        value: 'veriy important..! Try it yourself at https://intromaker.com/intro/408/ancient-quote'
    },
    cooldown: 2500,
    type: 'Generation'
}