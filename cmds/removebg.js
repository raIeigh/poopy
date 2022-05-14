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
            /*var res = await poopy.modules.axios.request({
                method: 'GET',
                url: 'https://api.remove.bg/v1.0/account',
                headers: {
                    'X-Api-Key': poopy.functions.randomKey('REMOVEBGKEY')
                }
            })
 
            var body = res.data
            var free_calls = Number(body.data.attributes.api.free_calls)*/

            var filepath = await poopy.functions.downloadFile(currenturl, `input.png`, {
                fileinfo: fileinfo
            })
            var filename = `input.png`

            var response = await poopy.functions.execPromise(`cd ${filepath} && removebg --api-key ${poopy.functions.randomKey('REMOVEBGKEY')} ${filename}`)
            var level = response.match(/level=[^ ]+/)[0].substring(6)

            if (level === 'error') {
                var m = response.match(/msg="([\s\S]*?)"/)[0].substring(4)
                m = m.substring(1, m.length - 1)
                var code = m.match(/\d+/)
                m = m.replace(/\d+: /, '')

                await msg.channel.send(m + (code == 402 ? '. You can go to https://www.remove.bg/ and upload an image manually though.' : '')).catch(() => { })
                await msg.channel.sendTyping().catch(() => { })
                poopy.modules.fs.rmSync(`${filepath}`, { force: true, recursive: true })
                return
            };

            try {
                poopy.modules.fs.renameSync(`${filepath}/input-removebg.png`, `${filepath}/output.png`)
            } catch (_) {
                await msg.channel.send('Couldn\'t send file.').catch(() => { })
                await msg.channel.sendTyping().catch(() => { })
                poopy.modules.fs.rmSync(`${filepath}`, { force: true, recursive: true })
                return
            }
            await poopy.functions.sendFile(msg, filepath, `output.png`/*, {
                        content: `Available command usages: **${free_calls - 1}**`
                    }*/)
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