module.exports = {
    name: ['speechtotext', 'speechrecognize'],
    execute: async function (msg, args) {
        let poopy = this

        await msg.channel.sendTyping().catch(() => { })
        if (poopy.data['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrl'] === undefined && args[1] === undefined) {
            await msg.channel.send('What is the file?!').catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        };
        var currenturl = poopy.data['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrl'] || args[1]
        var fileinfo = await poopy.functions.validateFile(currenturl, true).catch(async error => {
            await msg.channel.send(error).catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        })

        if (!fileinfo) return
        var type = fileinfo.type

        if (type.mime.startsWith('video')) {
            var filepath = await poopy.functions.downloadFile(currenturl, `input.mp4`, {
                fileinfo: fileinfo
            })
            var filename = `input.mp4`
            var audio = fileinfo.info.audio

            if (audio) {
                var aduration = Number(fileinfo.info.aduration.includes('N/A') ? '0' : fileinfo.info.aduration)
                if (aduration > 60) {
                    await msg.channel.send('The length of that audio surpasses 1 minute, try trimming it!').catch(() => { })
                    return
                }

                await poopy.functions.execPromise(`ffmpeg -i ${filepath}/${filename} -map 0:a -preset ${poopy.functions.findpreset(args)} ${filepath}/input.mp3`)

                var options = {
                    method: 'POST',
                    url: 'https://speech-recognition-english1.p.rapidapi.com/api/asr',
                    headers: {
                        'content-type': 'multipart/form-data; boundary=---011000010111000001101001',
                        'X-RapidAPI-Host': 'speech-recognition-english1.p.rapidapi.com',
                        'X-RapidAPI-Key': poopy.functions.randomKey('RAPIDAPIKEY'),
                        useQueryString: true
                    },
                    formData: {
                        sound: {
                            value: poopy.modules.fs.readFileSync(`${filepath}/input.mp3`),
                            options: { filename: 'input.mp3', contentType: 'application/octet-stream' }
                        }
                    }
                }

                var response = await poopy.functions.request(options).catch(async () => {
                    await msg.channel.send('Error recognizing speech in audio.').catch(() => { })
                })

                if (!response) return

                if (!(response.status >= 200 && response.status < 300)) {
                    await msg.channel.send(`${response.status} ${response.statusText}`).catch(() => { })
                    return
                }

                if (response.data.hasError) {
                    if (response.data.statusCode == 464) {
                        await msg.channel.send(`I can't hear the voices.`).catch(() => { })
                    } else {
                        await msg.channel.send(response.data.statusMessage).catch(() => { })
                    }
                    return
                }

                await msg.channel.send({
                    content: response.data.data.text.toLowerCase(),
                    allowedMentions: {
                        parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                    }
                }).catch(async () => {
                    var currentcount = poopy.vars.filecount
                    poopy.vars.filecount++
                    var filepath = `temp/${poopy.config.mongodatabase}/file${currentcount}`
                    poopy.modules.fs.mkdirSync(`${filepath}`)
                    poopy.modules.fs.writeFileSync(`${filepath}/speechtotext.txt`, response.data.data.text)
                    await msg.channel.send({
                        files: [new poopy.modules.Discord.MessageAttachment(`${filepath}/speechtotext.txt`)]
                    }).catch(() => { })
                    poopy.modules.fs.rmSync(`${filepath}`, { force: true, recursive: true })
                })
            } else {
                await msg.channel.send('No audio stream detected.').catch(() => { })
                await msg.channel.sendTyping().catch(() => { })
                poopy.modules.fs.rmSync(`${filepath}`, { force: true, recursive: true })
            }
        } else if (type.mime.startsWith('audio')) {
            var filepath = await poopy.functions.downloadFile(currenturl, `input.mp3`, {
                fileinfo: fileinfo
            })
            var filename = `input.mp3`

            var aduration = Number(fileinfo.info.aduration.includes('N/A') ? '0' : fileinfo.info.aduration)
            if (aduration > 60) {
                await msg.channel.send('The length of that audio surpasses 1 minute, try trimming it!').catch(() => { })
                return
            }

            var options = {
                method: 'POST',
                url: 'https://speech-recognition-english1.p.rapidapi.com/api/asr',
                headers: {
                    'content-type': 'multipart/form-data; boundary=---011000010111000001101001',
                    'X-RapidAPI-Host': 'speech-recognition-english1.p.rapidapi.com',
                    'X-RapidAPI-Key': poopy.functions.randomKey('RAPIDAPIKEY'),
                    useQueryString: true
                },
                formData: {
                    sound: {
                        value: poopy.modules.fs.readFileSync(`${filepath}/input.mp3`),
                        options: { filename: 'input.mp3', contentType: 'application/octet-stream' }
                    }
                }
            }

            var response = await poopy.functions.request(options).catch(async () => {
                await msg.channel.send('Error recognizing speech in audio.').catch(() => { })
            })

            if (!response) return

            if (!(response.status >= 200 && response.status < 300)) {
                await msg.channel.send(`${response.status} ${response.statusText}`).catch(() => { })
                return
            }

            if (response.data.hasError) {
                if (response.data.statusCode == 464) {
                    await msg.channel.send(`I can't hear the voices.`).catch(() => { })
                } else {
                    await msg.channel.send(response.data.statusMessage).catch(() => { })
                }
                return
            }

            await msg.channel.send({
                content: response.data.data.text.toLowerCase(),
                allowedMentions: {
                    parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                }
            }).catch(async () => {
                var currentcount = poopy.vars.filecount
                poopy.vars.filecount++
                var filepath = `temp/${poopy.config.mongodatabase}/file${currentcount}`
                poopy.modules.fs.mkdirSync(`${filepath}`)
                poopy.modules.fs.writeFileSync(`${filepath}/speechtotext.txt`, response.data.data.text)
                await msg.channel.send({
                    files: [new poopy.modules.Discord.MessageAttachment(`${filepath}/speechtotext.txt`)]
                }).catch(() => { })
                poopy.modules.fs.rmSync(`${filepath}`, { force: true, recursive: true })
            })
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
        name: '<:newpoopy:839191885310066729> speechtotext/speechrecognize <video/audio>',
        value: 'Tries to recognize the speech inside the audio of a file and convert it to text. Maximum duration is 1 minute.'
    },
    cooldown: 2500,
    type: 'Conversion'
}