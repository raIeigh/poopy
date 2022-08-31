module.exports = {
    name: ['speechtotext', 'speechrecognize'],
    args: [{"name":"file","required":false,"specifarg":false,"orig":"{file}"}],
    execute: async function (msg, args) {
        let poopy = this
        let { lastUrl, validateFile, downloadFile, execPromise, findpreset, randomKey, request } = poopy.functions
        let { fs, Discord } = poopy.modules
        let vars = poopy.vars
        let config = poopy.config

        await msg.channel.sendTyping().catch(() => { })
        if (lastUrl(msg, 0) === undefined && args[1] === undefined) {
            await msg.reply('What is the file?!').catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        };
        var currenturl = lastUrl(msg, 0) || args[1]
        var fileinfo = await validateFile(currenturl, true).catch(async error => {
            await msg.reply(error).catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        })

        if (!fileinfo) return
        var type = fileinfo.type

        if (type.mime.startsWith('video')) {
            var filepath = await downloadFile(currenturl, `input.mp4`, {
                fileinfo: fileinfo
            })
            var filename = `input.mp4`
            var audio = fileinfo.info.audio

            if (audio) {
                var aduration = Number(fileinfo.info.aduration.includes('N/A') ? '0' : fileinfo.info.aduration)
                if (aduration > 60) {
                    await msg.reply('The length of that audio surpasses 1 minute, try trimming it!').catch(() => { })
                    return
                }

                await execPromise(`ffmpeg -i ${filepath}/${filename} -map 0:a -preset ${findpreset(args)} ${filepath}/input.mp3`)

                var options = {
                    method: 'POST',
                    url: 'https://speech-recognition-english1.p.rapidapi.com/api/asr',
                    headers: {
                        'content-type': 'multipart/form-data; boundary=---011000010111000001101001',
                        'X-RapidAPI-Host': 'speech-recognition-english1.p.rapidapi.com',
                        'X-RapidAPI-Key': randomKey('RAPIDAPI_KEY'),
                        useQueryString: true
                    },
                    formData: {
                        sound: {
                            value: fs.readFileSync(`${filepath}/input.mp3`),
                            options: { filename: 'input.mp3', contentType: 'application/octet-stream' }
                        }
                    }
                }

                var response = await request(options).catch(async () => {
                    await msg.reply('Error recognizing speech in audio.').catch(() => { })
                })

                if (!response) return

                if (!(response.status >= 200 && response.status < 300)) {
                    await msg.reply(`${response.status} ${response.statusText}`).catch(() => { })
                    return
                }

                if (response.data.hasError) {
                    if (response.data.statusCode == 464) {
                        await msg.reply(`I can't hear the voices.`).catch(() => { })
                    } else {
                        await msg.reply(response.data.statusMessage).catch(() => { })
                    }
                    return
                }

                await msg.reply({
                    content: response.data.data.text.toLowerCase(),
                    allowedMentions: {
                        parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                    }
                }).catch(async () => {
                    var currentcount = vars.filecount
                    vars.filecount++
                    var filepath = `temp/${config.database}/file${currentcount}`
                    fs.mkdirSync(`${filepath}`)
                    fs.writeFileSync(`${filepath}/speechtotext.txt`, response.data.data.text)
                    await msg.reply({
                        files: [new Discord.MessageAttachment(`${filepath}/speechtotext.txt`)]
                    }).catch(() => { })
                    fs.rmSync(`${filepath}`, { force: true, recursive: true })
                })
            } else {
                await msg.reply('No audio stream detected.').catch(() => { })
                await msg.channel.sendTyping().catch(() => { })
                fs.rmSync(`${filepath}`, { force: true, recursive: true })
            }
        } else if (type.mime.startsWith('audio')) {
            var filepath = await downloadFile(currenturl, `input.mp3`, {
                fileinfo: fileinfo
            })
            var filename = `input.mp3`

            var aduration = Number(fileinfo.info.aduration.includes('N/A') ? '0' : fileinfo.info.aduration)
            if (aduration > 60) {
                await msg.reply('The length of that audio surpasses 1 minute, try trimming it!').catch(() => { })
                return
            }

            var options = {
                method: 'POST',
                url: 'https://speech-recognition-english1.p.rapidapi.com/api/asr',
                headers: {
                    'content-type': 'multipart/form-data; boundary=---011000010111000001101001',
                    'X-RapidAPI-Host': 'speech-recognition-english1.p.rapidapi.com',
                    'X-RapidAPI-Key': randomKey('RAPIDAPI_KEY'),
                    useQueryString: true
                },
                formData: {
                    sound: {
                        value: fs.readFileSync(`${filepath}/input.mp3`),
                        options: { filename: 'input.mp3', contentType: 'application/octet-stream' }
                    }
                }
            }

            var response = await request(options).catch(async () => {
                await msg.reply('Error recognizing speech in audio.').catch(() => { })
            })

            if (!response) return

            if (!(response.status >= 200 && response.status < 300)) {
                await msg.reply(`${response.status} ${response.statusText}`).catch(() => { })
                return
            }

            if (response.data.hasError) {
                if (response.data.statusCode == 464) {
                    await msg.reply(`I can't hear the voices.`).catch(() => { })
                } else {
                    await msg.reply(response.data.statusMessage).catch(() => { })
                }
                return
            }

            await msg.reply({
                content: response.data.data.text.toLowerCase(),
                allowedMentions: {
                    parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                }
            }).catch(async () => {
                var currentcount = vars.filecount
                vars.filecount++
                var filepath = `temp/${config.database}/file${currentcount}`
                fs.mkdirSync(`${filepath}`)
                fs.writeFileSync(`${filepath}/speechtotext.txt`, response.data.data.text)
                await msg.reply({
                    files: [new Discord.MessageAttachment(`${filepath}/speechtotext.txt`)]
                }).catch(() => { })
                fs.rmSync(`${filepath}`, { force: true, recursive: true })
            })
        } else {
            await msg.reply({
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
        name: 'speechtotext/speechrecognize {file}',
        value: 'Tries to recognize the speech inside the audio of a file and convert it to text. Maximum duration is 1 minute.'
    },
    cooldown: 2500,
    type: 'Text',
    envRequired: ['RAPIDAPI_KEY']
}