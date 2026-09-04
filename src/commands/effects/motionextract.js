module.exports = {
    name: ['motionextraction', 'motionextract'],
    args: [{name: "file",required: false,specifarg: false,orig: "{file}"},
        {name: "offset",required: false,specifarg: true,orig: "[-offset <number>]"}
    ],
    execute: async function (msg, args) {
        let poopy = this
        let {
            lastUrl, validateFile, downloadFile, execPromise,
            findpreset, sendFile, fetchPingPerms
        } = poopy.functions
        let { DiscordTypes, fs } = poopy.modules
        let vars = poopy.vars

        msg.channel.sendTyping().catch(() => { })
        if (lastUrl(msg, 0) === undefined && args[1] === undefined) {
            await msg.reply('What is the file?!').catch(() => { })
            msg.channel.sendTyping().catch(() => { })
            return;
        };
        var currenturl = lastUrl(msg, 0) || args[1]
        var fileinfo = await validateFile(currenturl).catch(async error => {
            await msg.reply({
                content: error,
                allowedMentions: fetchPingPerms(msg)
            }).catch(() => { })
            msg.channel.sendTyping().catch(() => { })
            return;
        })
        
        var framesOffset = 2
        var offsetindex = args.indexOf('-offset')
        if (offsetindex > -1) {
            var offsetNum = Number(args[offsetindex + 1])
            framesOffset = isNaN(offsetNum) ? 2 : (offsetNum < 1 ? 1 : Math.round(offsetNum))
            args.splice(offsetindex, 2)
        }

        if (!fileinfo) return
        var type = fileinfo.type

        if (type.mime.startsWith('image') && vars.gifFormats.find(f => f === type.ext)) {
            var filepath = await downloadFile(currenturl, `input.gif`, {fileinfo})
            var filename = `input.gif`

            fs.mkdir(`${filepath}/frames`)

            await execPromise(`ffmpeg -i ${filepath}/${filename} -vcodec png ${filepath}/frames/input_%06d.png`)
            await execPromise(`ffmpeg -i ${filepath}/${filename} -vf "negate,format=rgba,colorchannelmixer=aa=0.5" -vcodec png ${filepath}/frames/inverted_halfopacity_%06d.png`)
            await execPromise(`ffmpeg -i ${filepath}/frames/input_%06d.png -start_number ${framesOffset} -i ${filepath}/frames/inverted_halfopacity_%06d.png -i ${filepath}/${filename} -filter_complex "[0:v][1:v] overlay=0:0,split[pout][ppout];[ppout]palettegen=reserve_transparent=1[palette];[pout][palette]paletteuse=alpha_threshold=128[out]" -map "[out]" -preset ${findpreset(args)} -gifflags -offsetting ${filepath}/output.gif`)
            return await sendFile(msg, filepath, `output.gif`)
        } else if (type.mime.startsWith('video')) {
            var filepath = await downloadFile(currenturl, `input.mp4`, {fileinfo})
            var filename = `input.mp4`

            fs.mkdir(`${filepath}/frames`)

            await execPromise(`ffmpeg -i ${filepath}/${filename} -vcodec png ${filepath}/frames/input_%06d.png`).then((stdout, stderr) => { console.log(stdout); console.log(stderr) })
            await execPromise(`ffmpeg -i ${filepath}/${filename} -vf "negate,format=rgba,colorchannelmixer=aa=0.5" -vcodec png ${filepath}/frames/inverted_halfopacity_%06d.png`).then((stdout, stderr) => { console.log(stdout); console.log(stderr) })
            await execPromise(`ffmpeg -i ${filepath}/frames/input_%06d.png -start_number ${framesOffset} -i ${filepath}/frames/inverted_halfopacity_%06d.png -i ${filepath}/${filename} -filter_complex "[0:v][1:v] overlay=0:0" -c:v libx264 -preset ultrafast -c:a copy ${filepath}/output.mp4`).then((stdout, stderr) => { console.log(stdout); console.log(stderr) })
            return await sendFile(msg, filepath, `output.mp4`)
        } else {
            await msg.reply({
                content: `Unsupported file: \`${currenturl}\``,
                allowedMentions: fetchPingPerms(msg)
            }).catch(() => { })
            msg.channel.sendTyping().catch(() => { })
            return
        }
    },
    help: {
        name: 'motionextraction/motionextract {file} [-offset <number>]',
        value: 'Extracts the motion from a video by overlaying frames with previous ones. Default offset is 2 (= 1 frame behind). Based on that one [Posy video](https://www.youtube.com/watch?v=NSS6yAMZF78).'
    },
    cooldown: 2500,
    type: 'Effects'
}