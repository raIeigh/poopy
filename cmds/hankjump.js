module.exports = {
    name: ['hankjump', 'hank'],
    execute: async function (msg, args) {
        let poopy = this

        msg.channel.sendTyping().catch(() => { })
        if (poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrl'] === undefined && args[1] === undefined) {
            msg.channel.send('What is the file?!').catch(() => { })
            msg.channel.sendTyping().catch(() => { })
            return;
        }
        var currenturl = poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrl'] || args[1]
        var fileinfo = await poopy.functions.validateFile(currenturl).catch(error => {
            msg.channel.send(error)
            msg.channel.sendTyping().catch(() => { })
            return;
        })

        if (!fileinfo) return
        var type = fileinfo.type

        if (type.mime.startsWith('image') || type.mime.startsWith('video')) {
            var filepath = await poopy.functions.downloadFile(currenturl, `input.${fileinfo.shortext}`, {
                fileinfo: fileinfo
            })
            var filename = `input.${fileinfo.shortext}`
            await poopy.functions.execPromise(`ffmpeg -r 50 -stream_loop -1 -t 0.35 -i ${filepath}/${filename} -r 50 -stream_loop -1 -t 0.35 -i templates/transparent.png -filter_complex "[0:v]scale=100:100:force_original_aspect_ratio=decrease,split=3[overlay][overlay2][overlay3];[1:v]scale=300:300,split=3[transparent][transparent2][transparent3];[overlay]rotate=sin(PI/2*(t*5.6))*10*PI/180:ow=rotw(45):oh=roth(45):c=0x00000000[roverlay];[overlay2]rotate=sin(PI/2*(t*5.6))*-10*PI/180:ow=rotw(45):oh=roth(45):c=0x00000000[roverlay2];[overlay3]rotate=t*2.8*360*PI/180:ow=rotw(45):oh=roth(45):c=0x00000000[roverlay3];[transparent][roverlay]overlay=x=((W-w)/2)+sin(PI/2*(t*5.6))*5:y=(((H-h)/2)-sin(PI/2*(t*5.6))*100)+100:format=auto,split=5[jump1_1][jump1_2][jump1_3][jump1_4][jump1_5];[transparent2][roverlay2]overlay=x=((W-w)/2)+sin(PI/2*(t*5.6))*5:y=(((H-h)/2)-sin(PI/2*(t*5.6))*100)+100:format=auto,split=4[jump2_1][jump2_2][jump2_3][jump2_4];[transparent3][roverlay3]overlay=x=((W-w)/2)+sin(PI/2*(t*5.6))*5:y=(((H-h)/2)-sin(PI/2*(t*5.6))*100)+100:format=auto[jump3];[jump1_1][jump2_1][jump1_2][jump2_2][jump1_3][jump2_3][jump1_4][jump2_4][jump1_5][jump3]concat=n=10,split[pout][ppout];[ppout]palettegen=reserve_transparent=1[palette];[pout][palette]paletteuse=alpha_threshold=128[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} -gifflags -offsetting -r 50 ${filepath}/output.gif`)
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
    help: { name: 'hankjump/hank <file>', value: 'hank jumping gif' },
    cooldown: 2500,
    type: 'Inside Joke'
}