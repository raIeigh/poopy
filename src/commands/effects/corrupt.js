module.exports = {
    name: ['corrupt', 'therot'],
    args: [
        {name: "file", required: false, specifarg: false, orig: "{file}"},
        {name: "strength", required: false, specifarg: false, orig: "[-strength <0-1>]"},
        {name: "method", required: false, specifarg: false, orig: "[-method <PNG | JPEG | AVI>]", autocomplete: ['PNG', 'JPEG', 'AVI']}
    ],
    execute: async function (msg, args) {
        let poopy = this
        let {
            lastUrl, validateFile, downloadFile, execPromise,
            findpreset, sendFile, fetchPingPerms, rotMedia, getOption, parseNumber
        } = poopy.functions
        let { DiscordTypes, fs } = poopy.modules
        let vars = poopy.vars

        msg.channel.sendTyping().catch(() => { })
        if (lastUrl(msg, 0) === undefined && args[1] === undefined) {
            await msg.reply('What is the file?!').catch(() => { })
            msg.channel.sendTyping().catch(() => { })
            return;
        };
        var currenturl = lastUrl(msg, 0)
        var fileinfo = await validateFile(currenturl).catch(async error => {
            await msg.reply({
                content: error,
                allowedMentions: fetchPingPerms(msg)
            }).catch(() => { })
            msg.channel.sendTyping().catch(() => { })
            return;
        })

        if (!fileinfo) return

        var strength = getOption(args, 'strength', { dft: 0.25, n: 1, splice: false, func: (opt) => parseNumber(opt, { dft: 0.25, min: 0, max: 1, round: false }) })
        var method = getOption(args, 'method', { n: 1, splice: false })
        if (method !== undefined) {
            method = String(method)
            method = ['png', 'apng'].includes(method.toLowerCase()) ? 'PNG'
                : ['jpg', 'jpeg'].includes(method.toLowerCase()) ? 'JPEG'
                : ['avi'].includes(method.toLowerCase()) ? 'AVI' : undefined
        }

        var type = fileinfo.type

        if (!type.mime.startsWith('image') && !type.mime.startsWith('video')) {
            await msg.reply({
                content: `Unsupported file: \`${currenturl}\``,
                allowedMentions: fetchPingPerms(msg)
            }).catch(() => { })
            msg.channel.sendTyping().catch(() => { })
            return
        }
        
        const path = await downloadFile(fileinfo.buffer, fileinfo.name, { fileinfo, buffer: true })
        
        await rotMedia(`${path}/${fileinfo.name}`, fileinfo, strength, method).catch(() => { })

        setTimeout(() => {
            fs.rm(path, { force: true, recursive: true })
        }, 60_000)

        return await sendFile(msg, path, fileinfo.name)
    },
    help: {
        name: 'corrupt/therot {file} [-strength <0-1>] [-method <PNG | JPEG | AVI>]',
        value: "Corrupts the file's image data with the specified parameters using FFglitch. Default strength is 0.25. Default method is either PNG or AVI, depending on whether it's an image or a video. Audio corruption is not supported."
    },
    cooldown: 2500,
    type: 'Effects'
}