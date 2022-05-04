module.exports = {
    name: ['tdumpy', 'trollfaced', 'trollfacedmosaic'],
    execute: async function (msg, args) {
        let poopy = this

        msg.channel.sendTyping().catch(() => { })
        if (poopy.data['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrl'] === undefined && args[1] === undefined) {
            msg.channel.send('What is the file?!').catch(() => { })
            msg.channel.sendTyping().catch(() => { })
            return;
        };
        var resolution = 25
        var resolutionindex = args.indexOf('-resolution')
        if (resolutionindex > -1) {
            resolution = isNaN(Number(args[resolutionindex + 1])) ? 25 : Number(args[resolutionindex + 1]) <= 1 ? 1 : Number(args[resolutionindex + 1]) >= 40 ? 40 : Math.floor(Number(args[resolutionindex + 1])) || 25
        }
        var currenturl = poopy.data['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrl'] || args[1]
        var fileinfo = await poopy.functions.validateFile(currenturl).catch(error => {
            msg.channel.send(error)
            msg.channel.sendTyping().catch(() => { })
            return;
        })

        if (!fileinfo) return
        var type = fileinfo.type

        if (type.mime.startsWith('image') && !(poopy.vars.gifFormats.find(f => f === type.ext))) {
            var filepath = await poopy.functions.downloadFile(currenturl, 'input.png')
            var filename = 'input.png'
            poopy.modules.fs.copyFileSync(`templates/trollfaced.jar`, `${filepath}/trollfaced.jar`)

            await poopy.functions.execPromise(`cd ${filepath} && java -jar trollfaced.jar --file ${filename} --lines ${resolution}`)

            try {
                poopy.modules.fs.renameSync(`${filepath}/dumpy.gif`, `${filepath}/output.gif`)
            } catch (_) {
                await msg.channel.send('Couldn\'t send file.').catch(() => { })
                msg.channel.sendTyping().catch(() => { })
                poopy.modules.fs.rmSync(`${filepath}`, { force: true, recursive: true })
                return
            }
            await poopy.functions.sendFile(msg, filepath, `output.gif`)
        } else {
            msg.channel.send({
                content: `Unsupported file: \`${currenturl}\``,
                allowedMentions: {
                    parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                }
            }).catch(() => { })
            msg.channel.sendTyping().catch(() => { })
            return
        }
    },
    help: {
        name: 'tdumpy/trollfaced/trollfacedmosaic <image> [-resolution <number>]',
        value: 'IT? created the trollfaced mosaic'
    },
    cooldown: 2500,
    type: 'Inside Joke'
}