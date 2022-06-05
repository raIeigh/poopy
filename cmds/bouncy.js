module.exports = {
    name: ['bouncy', 'bounce', 'jumping', 'jump'],
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

        if (type.mime.startsWith('image') || type.mime.startsWith('video')) {
            var filepath = await poopy.functions.downloadFile(currenturl, `input.${fileinfo.shortext}`, {
                fileinfo: fileinfo
            })
            var filename = `input.${fileinfo.shortext}`
            await poopy.functions.execPromise(`ffmpeg -stream_loop -1 -t 0.25 -i ${filepath}/${filename} -r 50 -stream_loop -1 -t 0.25 -i assets/transparent.png -filter_complex "[0:v]fps=50,scale=100:100:force_original_aspect_ratio=decrease[overlay];[1:v]scale=300:300[transparent];[transparent][overlay]overlay=x=((W-w)/2)-cos(PI/2*(t*8))*100:y=((H-h)/2)-sin(PI/2*(t*8))*100:format=auto[overlayed];[overlayed]split[normal][reverse];[reverse]reverse[reversed];[normal][reversed]concat,crop=300:200:0:0,split[pout][ppout];[ppout]palettegen=reserve_transparent=1[palette];[pout][palette]paletteuse=alpha_threshold=128[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} -gifflags -offsetting -r 50 -t 0.5 ${filepath}/output.gif`)
            await poopy.functions.sendFile(msg, filepath, `output.gif`)
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
        name: 'bouncy/bounce/jumping/jump <file>',
        value: 'Makes the file bounce around in a transparent background.'
    },
    cooldown: 2500,
    type: 'Animation'
}