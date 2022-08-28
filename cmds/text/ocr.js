module.exports = {
    name: ['ocr', 'recognizetext'],
    args: [{"name":"file","required":false,"specifarg":false,"orig":"{file}"}],
    execute: async function (msg, args) {
        let poopy = this
        let { lastUrl, validateFile, randomKey } = poopy.functions
        let { axios, fs, Discord } = poopy.modules
        let vars = poopy.vars
        let config = poopy.config

        await msg.channel.sendTyping().catch(() => { })
        if (lastUrl(msg, 0) === undefined && args[1] === undefined) {
            await msg.reply('What is the file to recognize?!').catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        };
        var currenturl = lastUrl(msg, 0) || args[1]
        var fileinfo = await validateFile(currenturl).catch(async error => {
            await msg.reply(error).catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        })

        if (!fileinfo) return
        var type = fileinfo.type

        if (type.mime.startsWith('image')) {
            var options = {
                method: 'POST',
                url: 'https://microsoft-computer-vision3.p.rapidapi.com/ocr',
                params: { detectOrientation: 'true', language: 'unk' },
                headers: {
                    'content-type': 'application/json',
                    'x-rapidapi-host': 'microsoft-computer-vision3.p.rapidapi.com',
                    'x-rapidapi-key': randomKey('RAPIDAPI_KEY')
                },
                data: {
                    url: currenturl
                }
            }

            var response = await axios.request(options).catch(async () => {
                await msg.reply('Error.').catch(() => { })
            })

            if (!response) return

            var body = response.data
            var regions = body.regions

            if (regions.length <= 0) {
                await msg.reply(`No text detected.`).catch(() => { })
                return
            }

            var result = regimap(region => region.lines.map(line => line.words.map(word => word.text).join(' ')).join('\n')).join('\n\n')

            await msg.reply({
                content: `Language: \`${body.language}\`\n\`\`\`\n${result}\n\`\`\``,
                allowedMentions: {
                    parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                }
            }).catch(async () => {
                var currentcount = vars.filecount
                vars.filecount++
                var filepath = `temp/${config.mongodatabase}/file${currentcount}`
                fs.mkdirSync(`${filepath}`)
                fs.writeFileSync(`${filepath}/ocr.txt`, result)
                await msg.reply({
                    content: `Language: \`${body.language}\``,
                    files: [new Discord.MessageAttachment(`${filepath}/ocr.txt`)]
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
        name: 'ocr/recognizetext {file}',
        value: "Recognizes text within an image with Microsoft's Computer Vision."
    },
    cooldown: 2500,
    type: 'Text',
    envRequired: ['RAPIDAPI_KEY']
}