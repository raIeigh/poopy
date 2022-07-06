module.exports = {
    name: ['frames', 'extractframes', 'getframes'],
    execute: async function (msg, args) {
        let poopy = this

        await msg.channel.sendTyping().catch(() => { })
        if (poopy.functions.lastUrl(msg.guild.id, msg.channel.id, 0) === undefined && args[1] === undefined) {
            await msg.channel.send('What is the file?!').catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        };
        var currenturl = poopy.functions.lastUrl(msg.guild.id, msg.channel.id, 0) || args[1]
        var fileinfo = await poopy.functions.validateFile(currenturl).catch(async error => {
            await msg.channel.send(error).catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        })

        if (!fileinfo) return
        var type = fileinfo.type

        if (type.mime.startsWith('video') || (type.mime.startsWith('image') && poopy.vars.gifFormats.find(f => f === type.ext))) {
            var filepath = await poopy.functions.downloadFile(currenturl, `input.${fileinfo.shortext}`, {
                fileinfo: fileinfo
            })
            var filename = `input.${fileinfo.shortext}`
            poopy.modules.fs.mkdirSync(`${filepath}/frames`)

            await poopy.functions.execPromise(`ffmpeg -i ${filepath}/${filename} ${filepath}/frames/frame_%04d.png`)
            var output = poopy.modules.fs.createWriteStream(`${filepath}/output.zip`)
            var archive = poopy.modules.archiver('zip')

            output.on('finish', async () => {
                var frames = poopy.modules.fs.readdirSync(`${filepath}/frames`)
                var catboxframes = {}

                await poopy.functions.navigateEmbed(msg.channel, async (page, ended) => {
                    var frameurl = ended ? await poopy.vars.Catbox.upload(`${filepath}/frames/${frames[page - 1]}`).catch(() => { }) : catboxframes[frames[page - 1]]

                    if (!frameurl && !ended) {
                        frameurl = await poopy.vars.Litterbox.upload(`${filepath}/frames/${frames[page - 1]}`).catch(() => { }) ?? ''
                        catboxframes[frames[page - 1]] = frameurl
                    }

                    if (poopy.config.textEmbeds) return `${frameurl}\n\nFrame ${page}/${frames.length}`
                    else return {
                        "title": fileinfo.name,
                        "url": currenturl,
                        "color": 0x472604,
                        "image": {
                            "url": frameurl
                        },
                        "footer": {
                            "icon_url": poopy.bot.user.displayAvatarURL({ dynamic: true, size: 1024, format: 'png' }),
                            "text": `Frame ${page}/${frames.length}`
                        },
                    }
                }, frames.length, msg.member, [
                    {
                        emoji: '939523064658526278',
                        reactemoji: '⏬',
                        customid: 'zip',
                        style: 'PRIMARY',
                        function: async (_, __, resultsMsg, collector) => {
                            collector.stop()
                            resultsMsg.delete().catch(() => { })
                            poopy.functions.sendFile(msg, filepath, `output.zip`)
                        },
                        page: false
                    }
                ], undefined, undefined, undefined, (reason) => {
                    if (reason == 'time') poopy.modules.fs.rmSync(filepath, { force: true, recursive: true })
                }, msg)
            });

            archive.pipe(output)
            archive.directory(`${filepath}/frames`, false)
            archive.finalize()
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
        name: 'frames/extractframes/getframes <video/gif>',
        value: 'Extracts all of the frames in the video/GIF and archives them in a ZIP file.'
    },
    cooldown: 2500,
    type: 'Conversion'
}