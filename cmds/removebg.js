module.exports = {
    name: ['removebg', 'removebackground'],
    execute: async function (msg, args) {
        let poopy = this

        await msg.channel.sendTyping().catch(() => { })
        if (poopy.data['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrl'] === undefined && args[1] === undefined) {
            await msg.channel.send('What is the file?!').catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        };
        var currenturl = poopy.data['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrl'] || args[1]
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

            var response = await poopy.functions.request({
                url: 'https://api.remove.bg/v1.0/removebg',
                method: 'POST',
                formData: {
                    size: 'auto',
                    image_file: {
                        value: poopy.modules.fs.readFileSync(`${filepath}/${filename}`),
                        options: { filename: filename, contentType: 'application/octet-stream' }
                    }
                },
                headers: {
                    'content-type': 'multipart/form-data; boundary=---011000010111000001101001',
                    'X-Api-Key': poopy.functions.randomKey('REMOVEBGKEY')
                }
            }).catch(() => { })

            if (response.status != 200) {
                var m = response.data.errors[0].title
                var code = response.status

                await msg.channel.send(m + (code == 402 ? '. You can go to https://www.remove.bg/ and upload an image manually though.' : '')).catch(() => { })
                await msg.channel.sendTyping().catch(() => { })
                poopy.modules.fs.rmSync(`${filepath}`, { force: true, recursive: true })
                return
            };

            await poopy.functions.downloadFile(Buffer.from(response.data), `output.png`, {
                buffer: true,
                filepath: filepath
            })
            await poopy.functions.sendFile(msg, filepath, `output.png`)
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
    type: 'Effects'
}