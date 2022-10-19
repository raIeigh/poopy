module.exports = {
    name: ['dalle2variations'],
    args: [{"name":"file","required":false,"specifarg":false,"orig":"{file}"}],
    execute: async function (msg, args, opts) {
        let poopy = this
        let config = poopy.config
        let { lastUrl, validateFile, userToken, downloadFile, execPromise, sleep, navigateEmbed } = poopy.functions
        let { fs, axios, Discord } = poopy.modules
        let bot = poopy.bot

        var tokens = data.userData[msg.author.id]['tokens']['DALLE2_SESSION'] ?? []

        var ownerid = config.ownerids.find(id => id == msg.author.id);
        if (ownerid === undefined && !opts.ownermode && !tokens.length) {
            await msg.reply('You need the `DALLE2_SESSION` token for this!').catch(() => { })
            return
        }

        var choosenToken = userToken(msg.author.id, 'DALLE2_SESSION')

        if (lastUrl(msg, 0) === undefined && args[1] === undefined) {
            await msg.reply('What is the file?!').catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        };
        var currenturl = lastUrl(msg, 0)
        var fileinfo = await validateFile(currenturl, true).catch(async error => {
            await msg.reply(error).catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        })

        if (!fileinfo) return
        var type = fileinfo.type

        if (type.mime.startsWith('image')) {
            var filepath = await downloadFile(currenturl, `input.png`, {
                fileinfo: fileinfo
            })
            var filename = 'input.png'
            
            await execPromise(`ffmpeg -i ${filepath}/${filename} -vf "crop=w='min(min(iw,ih),500)':h='min(min(iw,ih),500)',scale=1024:1024,setsar=1" -vframes 1 ${filepath}/output.png`)

            if (!fs.existsSync(`${filepath}/output.png`)) return

            var imageData = fs.readFileSync(`${filepath}/output.png`)

            var waitMsg = await msg.reply(`Haha... This might take a century`).catch(() => { })

            var processInterval = setInterval(async () => {
                await msg.channel.sendTyping().catch(() => { })
            }, 5000)
            await msg.channel.sendTyping().catch(() => { })

            function fail() {
                clearInterval(processInterval)
                waitMsg.edit('I failed.').catch(() => { })
            }

            async function dalle2Request() {
                var taskRes = await axios.request({
                    url: 'https://labs.openai.com/api/labs/tasks',
                    method: 'POST',
                    data: {
                        prompt: {
                            batch_size: 4,
                            image: imageData.toString('base64')
                        },
                        task_type: "variations"
                    },
                    headers: {
                        Authorization: `Bearer ${choosenToken}`
                    }
                }).catch(() => { })

                if (!taskRes) {
                    fail()
                    return
                }

                var taskId = taskRes.data.id
                var imageRes

                while (!imageRes) {
                    await sleep(20000)

                    var taskCompleteRes = await axios.request({
                        url: `https://labs.openai.com/api/labs/tasks/${taskId}`,
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${choosenToken}`
                        }
                    })

                    if (taskCompleteRes) {
                        var status = taskCompleteRes.data.status
                        
                        if (status == 'succeeded') {
                            imageRes = taskCompleteRes
                            break
                        } else if (status == 'rejected') {
                            fail()
                            return
                        }
                    }
                }

                clearInterval(processInterval)
                waitMsg.delete().catch(() => { })

                return imageRes
            }

            var imageRes = await dalle2Request().catch(() => { })
            if (!imageRes) return

            var images = imageRes.data.generatidata.map(gdata => gdata.generation.image_path)

            await navigateEmbed(msg.channel, async (page) => {
                if (config.textEmbeds) return `${images[page - 1]}\n\nImage ${page}/${images.length}`
                else return {
                    "title": `DALL·E 2 generations for ${fileinfo.name}`,
                    "color": 0x472604,
                    "image": {
                        "url": images[page - 1]
                    },
                    "footer": {
                        "icon_url": bot.user.displayAvatarURL({ dynamic: true, size: 1024, format: 'png' }),
                        "text": `Image ${page}/${images.length}`
                    },
                }
            }, images.length, msg.member, [
                {
                    emoji: '874406183933444156',
                    reactemoji: '❌',
                    customid: 'delete',
                    style: Discord.ButtonStyle.Danger,
                    function: async (_, __, resultsMsg, collector) => {
                        collector.stop()
                        resultsMsg.delete().catch(() => { })
                    },
                    page: false
                }
            ], undefined, undefined, undefined, undefined, msg)
        } else {
            await msg.reply({
                content: `Unsupported file: \`${currenturl}\``,
                allowedMentions: {
                    parse: ((!msg.member.permissions.has('Administrator') && !msg.member.permissions.has('MentionEveryone') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                }
            }).catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return
        }
    },
    help: {
        name: 'dalle2variations {file} (requires DALLE2_SESSION token)',
        value: "Generates 4 variations from the specified image with DALL·E 2."
    },
    cooldown: 2500,
    type: 'Generation',
    envRequired: ['DALLE2_SESSION']
}