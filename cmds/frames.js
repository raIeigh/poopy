module.exports = {
    name: ['frames', 'extractframes', 'getframes'],
    execute: async function (msg, args) {
        let poopy = this

        msg.channel.sendTyping().catch(() => { })
        if (poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrl'] === undefined && args[1] === undefined) {
            msg.channel.send('What is the file?!').catch(() => { })
            msg.channel.sendTyping().catch(() => { })
            return;
        };
        var currenturl = poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrl'] || args[1]
        var fileinfo = await poopy.functions.validateFile(currenturl).catch(error => {
            msg.channel.send(error)
            msg.channel.sendTyping().catch(() => { })
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
                var number = 1
                var frames = poopy.modules.fs.readdirSync(`${filepath}/frames`)
                var catboxframes = {}
                var frameurl = await poopy.vars.Catbox.upload(`${filepath}/frames/${frames[number - 1]}`).catch(() => { }) ?? ''
                catboxframes[frames[number - 1]] = frameurl
                var frameEmbed = {
                    "color": 0x472604,
                    "image": {
                        "url": catboxframes[frames[number - 1]]
                    },
                    "footer": {
                        "icon_url": poopy.bot.user.displayAvatarURL({ dynamic: true, size: 1024, format: 'png' }),
                        "text": `Frame ${number}/${frames.length}`
                    },
                }
                var reactions = [
                    {
                        reaction: "861253229723123762",
                        function: () => {
                            return 1
                        },
                    },
                    {
                        reaction: "861253229726793728",
                        function: (number) => {
                            return number - 1
                        },
                    },
                    {
                        reaction: "861253230070988860",
                        function: () => {
                            return Math.floor(Math.random() * frames.length) + 1
                        },
                    },
                    {
                        reaction: "861253229798621205",
                        function: (number) => {
                            return number + 1
                        },
                    },
                    {
                        reaction: "861253229740556308",
                        function: () => {
                            return frames.length
                        },
                    },
                ]
                var buttonRow = new poopy.modules.Discord.MessageActionRow()
                reactions.forEach(reaction => {
                    var button = new poopy.modules.Discord.MessageButton()
                        .setStyle('PRIMARY')
                        .setEmoji(reaction.reaction)
                        .setCustomId(reaction.reaction)
                    buttonRow.addComponents([button])
                })
                var zipRow = new poopy.modules.Discord.MessageActionRow()
                var zip = new poopy.modules.Discord.MessageButton()
                    .setStyle('PRIMARY')
                    .setEmoji('939523064658526278')
                    .setCustomId('zip')
                zipRow.addComponents([zip])

                msg.channel.send({
                    embeds: [frameEmbed],
                    components: [buttonRow, zipRow]
                }).then(async sentMessage => {
                    var frameMessage = sentMessage
                    var filter = async (button) => {
                        if (poopy.tempdata[msg.author.id]['promises'].find(promise => promise.promise === p).active === false) return
                        if (!(button.user.id === msg.author.id && button.user.id !== poopy.bot.user.id && !button.user.bot)) {
                            button.deferUpdate().catch(() => { })
                            return
                        }
                        if (button.customId === zip.customId) {
                            frameMessage.delete().catch(() => { })
                            await poopy.functions.sendFile(msg, filepath, `output.zip`)
                            return
                        }
                        if (reactions.find(findreaction => findreaction.reaction === button.customId).function(number) > frames.length || reactions.find(findreaction => findreaction.reaction === button.customId).function(number) < 1) {
                            button.deferUpdate().catch(() => { })
                            return
                        }
                        number = reactions.find(findreaction => findreaction.reaction === button.customId).function(number)
                        if (!catboxframes[frames[number - 1]]) {
                            var frameurl = await poopy.vars.Catbox.upload(`${filepath}/frames/${frames[number - 1]}`).catch(() => { }) ?? ''
                            catboxframes[frames[number - 1]] = frameurl
                        }
                        frameEmbed = {
                            "color": 0x472604,
                            "image": {
                                "url": catboxframes[frames[number - 1]]
                            },
                            "footer": {
                                "icon_url": poopy.bot.user.displayAvatarURL({ dynamic: true, size: 1024, format: 'png' }),
                                "text": `Frame ${number}/${frames.length}`
                            },
                        }
                        frameMessage.edit({
                            embeds: [frameEmbed],
                            components: [buttonRow, zipRow]
                        }).catch(() => { })
                        button.deferUpdate().catch(() => { })
                    }
                    for (var i in poopy.tempdata[msg.author.id]['promises']) {
                        if (poopy.tempdata[msg.author.id]['promises'][i]) {
                            poopy.tempdata[msg.author.id]['promises'][i]['active'] = false
                        }
                    }
                    var p = frameMessage.awaitMessageComponent({ componentType: 'BUTTON', time: 600000, filter }).then(() => {
                        for (var i in poopy.tempdata[msg.author.id]['promises']) {
                            if (poopy.tempdata[msg.author.id]['promises'][i] == p) {
                                poopy.tempdata[msg.author.id]['promises'][i] = undefined
                                break
                            }
                        }
                        if (!frameMessage.edit) return
                        frameMessage.edit({
                            embeds: [frameEmbed],
                            components: []
                        }).catch(() => { })
                        try {
                            poopy.modules.fs.rmSync(filepath, { force: true, recursive: true })
                        } catch (_) { }
                    })
                        .catch((err) => {
                            if (err.message.endsWith('reason: time')) {
                                frameMessage.edit({
                                    embeds: [frameEmbed],
                                    components: []
                                }).catch(() => { })
                                try {
                                    poopy.modules.fs.rmSync(filepath, { force: true, recursive: true })
                                } catch (_) { }
                            }
                        })
                    poopy.tempdata[msg.author.id]['promises'].push({ promise: p, active: true })
                })
                    .catch(() => { })
            });

            archive.pipe(output)
            archive.directory(`${filepath}/frames`, false);
            archive.finalize()
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
        name: 'frames/extractframes/getframes <video/gif>',
        value: 'Extracts all of the frames in the video/GIF and archives them in a ZIP file.'
    },
    cooldown: 2500,
    type: 'Conversion'
}