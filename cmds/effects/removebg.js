module.exports = {
    name: ['removebg', 'removebackground'],
    args: [{"name":"file","required":false,"specifarg":false,"orig":"{file}"}],
    execute: async function (msg, args) {
        let poopy = this
        let { lastUrl, validateFile, downloadFile, randomKey, sendFile } = poopy.functions
        let vars = poopy.vars
        let modules = poopy.modules

        await msg.channel.sendTyping().catch(() => { })
        if (lastUrl(msg, 0) === undefined && args[1] === undefined) {
            await msg.reply('What is the file?!').catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        };
        var currenturl = lastUrl(msg, 0) || args[1]
        var fileinfo = await validateFile(currenturl).catch(async error => {
            await msg.reply(error).catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        })

        if (!fileinfo) return
        var type = fileinfo.type

        if (type.mime.startsWith('image') && !(vars.gifFormats.find(f => f === type.ext))) {
            var filepath = await downloadFile(currenturl, `input.png`, {
                fileinfo: fileinfo
            })
            var filename = `input.png`

            var form = new modules.FormData()
            form.append('size', 'auto')
            form.append('image_file', modules.fs.readFileSync(`${filepath}/${filename}`), filename)

            var rejected = false
            var response = await modules.axios.request({
                url: 'https://api.remove.bg/v1.0/removebg',
                method: 'POST',
                data: form,
                headers: {
                    ...form.getHeaders(),
                    'X-Api-Key': randomKey('REMOVEBGKEY')
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

                await msg.reply(m + (code == 402 ? '. You can go to https://www.remove.bg/ and upload an image manually though.' : '')).catch(() => { })
                modules.fs.rmSync(`${filepath}`, { force: true, recursive: true })
                return
            }

            await downloadFile(response.data, `output.png`, {
                buffer: true,
                filepath: filepath
            })
            return await sendFile(msg, filepath, `output.png`)
        } else {
            await msg.reply({
                content: `Unsupported file: \`${currenturl}\``,
                allowedMentions: {
                    parse: ((!msg.member.permissihas('ADMINISTRATOR') && !msg.member.permissihas('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                }
            }).catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return
        }
    },
    help: {
        name: 'removebg/removebackground {file}',
        value: "Removes an image's background with remove.bg. It has limits though."
    },
    cooldown: 2500,
    type: 'Effects',
    envRequired: ['REMOVEBGKEY']
}