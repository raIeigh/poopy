module.exports = {
    name: ['removebg', 'removebackground'],
    execute: async function (msg, args) {
        let poopy = this

        await msg.channel.sendTyping().catch(() => { })
        if (poopy.functions.lastUrl(msg.guild.id, msg.channel.id, 0) === undefined && args[1] === undefined) {
            await msg.channel.send('What is the file?!').catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        };
        var currenturl = poopy.functions.lastUrl(msg.guild.id, msg.channel.id, 0) || args[1]
        var fileinfo = await poopy.functions.validateFile(currenturl).catch(async error => {
            await msg.channel.send(error).catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        })

        if (!fileinfo) return
        var type = fileinfo.type

        if (type.mime.startsWith('image') && !(poopy.vars.gifFormats.find(f => f === type.ext))) {
            var filepath = await poopy.functions.downloadFile(currenturl, `input.png`, {
                fileinfo: fileinfo
            })
            var filename = `input.png`

            var form = new poopy.modules.FormData()
            form.append('size', 'auto')
            form.append('image_file', poopy.modules.fs.readFileSync(`${filepath}/${filename}`), filename)

            var rejected = false
            var response = await poopy.modules.axios.request({
                url: 'https://api.remove.bg/v1.0/removebg',
                method: 'POST',
                data: form,
                headers: {
                    ...form.getHeaders(),
                    'X-Api-Key': poopy.functions.randomKey('REMOVEBGKEY')
                },
                encoding: null,
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
                var m = response.data.errors[0].title
                var code = response.status

                await msg.channel.send(m + (code == 402 ? '. You can go to https://www.remove.bg/ and upload an image manually though.' : '')).catch(() => { })
                poopy.modules.fs.rmSync(`${filepath}`, { force: true, recursive: true })
                return
            }

            await poopy.functions.downloadFile(response.data, `output.png`, {
                buffer: true,
                filepath: filepath
            })
            return await poopy.functions.sendFile(msg, filepath, `output.png`)
        } else {
            await msg.channel.send({
                content: `Unsupported file: \`${currenturl}\``,
                allowedMentions: {
                    parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                }
            }).catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return
        }
    },
    help: {
        name: 'removebg/removebackground <image>',
        value: "Removes an image's background with remove.bg. It has limits though."
    },
    cooldown: 2500,
    type: 'Effects',
    envRequired: ['REMOVEBGKEY']
}