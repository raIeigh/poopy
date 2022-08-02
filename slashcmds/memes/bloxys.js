module.exports = {
    name: ['bloxys', 'bloxy'],
    execute: async function (msg, args) {
        let poopy = this

        await msg.channel.sendTyping().catch(() => { })
        if (poopy.functions.lastUrl(msg, 0) === undefined && args[1] === undefined) {
            await msg.channel.send('What is the file?!').catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        };
        var currenturl = poopy.functions.lastUrl(msg, 0) || args[1]
        var saidMessage = args.slice(1).join(' ')
        poopy.vars.symbolreplacements.forEach(symbolReplacement => {
            symbolReplacement.target.forEach(target => {
                saidMessage = saidMessage.replace(new RegExp(target, 'ig'), symbolReplacement.replacement)
            })
        })
        var matchedTextes = saidMessage.match(/"([\s\S]*?)"/)
        if (!matchedTextes) {
            matchedTextes = ['""', '']
        }
        var text = matchedTextes[1]
        var fileinfo = await poopy.functions.validateFile(currenturl).catch(async error => {
            await msg.channel.send(error).catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        })

        if (!fileinfo) return
        var type = fileinfo.type

        if (type.mime.startsWith('image') || type.mime.startsWith('video')) {
            var filepath = await poopy.functions.downloadFile(currenturl, `input.${fileinfo.shortext}`, {
                fileinfo: fileinfo
            })
            var filename = `input.${fileinfo.shortext}`

            var gotham = await poopy.modules.Jimp.loadFont(`assets/fonts/Gotham/Gotham.fnt`)
            var bloxys = await poopy.modules.Jimp.read('assets/bloxys.png')
            await bloxys.print(gotham, 88, 190, { text: poopy.modules.Discord.Util.cleanContent(text, msg), alignmentX: poopy.modules.Jimp.HORIZONTAL_ALIGN_CENTER, alignmentY: poopy.modules.Jimp.VERTICAL_ALIGN_TOP }, 221, 33)
            await bloxys.writeAsync(`${filepath}/bloxy.png`)

            await poopy.functions.execPromise(`ffmpeg -stream_loop -1 -i ${filepath}/${filename} -i ${filepath}/bloxy.png -i assets/bloxys.mp3 -filter_complex "[0:v]scale=219:124[frame];[1:v][frame]overlay=x=89:y=64:format=auto[oout];[oout]scale=ceil(iw/2)*2:ceil(ih/2)*2[out]" -shortest -map "[out]" -preset ${poopy.functions.findpreset(args)} -map 2:a:0 -c:v libx264 -pix_fmt yuv420p -t 00:00:07.05 -y ${filepath}/output.mp4`)
            return await poopy.functions.sendFile(msg, filepath, `output.mp4`)
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
    help: { name: 'bloxys/bloxy "{name}" <file>', value: 'YOU WON A BLOXY!' },
    cooldown: 2500,
    type: 'Memes'
}