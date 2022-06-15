module.exports = {
    name: ['ancientquote'],
    execute: async function (msg, args) {
        let poopy = this

        await msg.channel.sendTyping().catch(() => { })
        var saidMessage = args.join(' ').substring(args[0].length + 1)
        if (args[1] === undefined) {
            await msg.channel.send('What is the text?!').catch(() => { })
            return
        }

        var introeditorresponse = await poopy.modules.axios.get('https://intromaker.com/intro/408/ancient-quote/editor').catch(async () => {
            await msg.channel.send('Error generating video.').catch(() => { })
        })

        if (!introeditorresponse) return

        console.log(introeditorresponse.headers)

        var $ = poopy.modules.cheerio.load(introeditorresponse.data)
        var editorScript = $('script#editor')[0]
        $ = poopy.modules.cheerio.load(editorScript.children[0].data)
        var token = $('input[name=_token]')[0].attribs.value

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
                cookie: introeditorresponse.headers['set-cookie'].map(cookie => cookie.split(';')[0]).join('; '),
                'content-type': 'multipart/form-data; boundary=---011000010111000001101001'
            },
            followAllRedirects: true
        }).catch(async () => {
            await msg.channel.send('Error generating video.').catch(() => { })
        })

        if (!response) return

        console.log(response)

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