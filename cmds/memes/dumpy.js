module.exports = {
    name: ['dumpy', 'twerkmosaic', 'amongmosaic', 'amongusmosaic', 'crewmateamosaic'],
    args: [{"name":"file","required":false,"specifarg":false,"orig":"{file}"},{"name":"resolution","required":false,"specifarg":true,"orig":"[-resolution <number>]"}],
    execute: async function (msg, args) {
        let poopy = this

        await msg.channel.sendTyping().catch(() => { })
        if (poopy.functions.lastUrl(msg, 0) === undefined && args[1] === undefined) {
            await msg.channel.send('What is the file?!').catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        };
        var resolution = 25
        var resolutionindex = args.indexOf('-resolution')
        if (resolutionindex > -1) {
            resolution = isNaN(Number(args[resolutionindex + 1])) ? 25 : Number(args[resolutionindex + 1]) <= 1 ? 1 : Number(args[resolutionindex + 1]) >= 40 ? 40 : Math.floor(Number(args[resolutionindex + 1])) || 25
        }
        var currenturl = poopy.functions.lastUrl(msg, 0) || args[1]
        var fileinfo = await poopy.functions.validateFile(currenturl).catch(async error => {
            await msg.channel.send(error).catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        })

        if (!fileinfo) return
        var type = fileinfo.type

        if (type.mime.startsWith('image') && !(poopy.vars.gifFormats.find(f => f === type.ext))) {
            var filepath = await poopy.functions.downloadFile(currenturl, 'input.png')
            var filename = 'input.png'
            poopy.modules.fs.copyFileSync(`assets/amongUs.jar`, `${filepath}/amongUs.jar`)

            await poopy.functions.execPromise(`cd ${filepath} && java -jar amongUs.jar --file ${filename} --lines ${resolution}`)

            try {
                poopy.modules.fs.renameSync(`${filepath}/dumpy.gif`, `${filepath}/output.gif`)
            } catch (_) {
                await msg.channel.send('Couldn\'t send file.').catch(() => { })
                await msg.channel.sendTyping().catch(() => { })
                poopy.modules.fs.rmSync(`${filepath}`, { force: true, recursive: true })
                return
            }
            return await poopy.functions.sendFile(msg, filepath, `output.gif`)
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
        name: 'dumpy/twerkmosaic/amongmosaic/amongusmosaic/crewmateamosaic {file} [-resolution <number>]',
        value: 'Fun Fact: poopy has 3 among us related commands'
    },
    cooldown: 2500,
    type: 'Memes'
}