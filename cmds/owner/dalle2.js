module.exports = {
    name: ['dalle2'],
    args: [{"name":"option","required":true,"specifarg":false}],
    execute: async function (msg, args, opts) {
        let poopy = this

        var ownerid = poopy.config.ownerids.find(id => id == msg.author.id);
        if (ownerid === undefined && !opts.ownermode) {
            await msg.channel.send('Owner only!').catch(() => { })
            return
        }

        var options = {
            text2im: async (msg, args) => {
                if (!args[1]) {
                    await msg.channel.send('What is the text?!').catch(() => { })
                    await msg.channel.sendTyping().catch(() => { })
                    return;
                }

                var text = args.slice(1).join(' ')

                var waitMsg = await msg.channel.send(`Haha... This might take a century`).catch(() => { })

                var processInterval = setInterval(async () => {
                    await msg.channel.sendTyping().catch(() => { })
                }, 5000)
                await msg.channel.sendTyping().catch(() => { })

                function fail() {
                    clearInterval(processInterval)
                    waitMsg.edit('I failed.').catch(() => { })
                }

                async function dalle2Request() {
                    var taskRes = await poopy.modules.axios.request({
                        url: 'https://labs.openai.com/api/labs/tasks',
                        method: 'POST',
                        data: {
                            prompt: {
                                batch_size: 4,
                                caption: text
                            },
                            task_type: "text2im"
                        },
                        headers: {
                            Authorization: `Bearer ${process.env.DALLE2KEY}`
                        }
                    }).catch(() => { })

                    if (!taskRes) {
                        fail()
                        return
                    }

                    var taskId = taskRes.data.id
                    var imageRes

                    while (!imageRes) {
                        await poopy.functions.sleep(20000)

                        var taskCompleteRes = await poopy.modules.axios.request({
                            url: `https://labs.openai.com/api/labs/tasks/${taskId}`,
                            method: 'GET',
                            headers: {
                                Authorization: `Bearer ${process.env.DALLE2KEY}`
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

                var images = imageRes.data.generations.data.map(gdata => gdata.generation.image_path)

                await poopy.functions.navigateEmbed(msg.channel, async (page) => {
                    if (poopy.config.textEmbeds) return `${images[page - 1]}\n\nImage ${page}/${images.length}`
                    else return {
                        "title": `DALL·E 2 results for ${text}`,
                        "color": 0x472604,
                        "image": {
                            "url": images[page - 1]
                        },
                        "footer": {
                            "icon_url": poopy.bot.user.displayAvatarURL({ dynamic: true, size: 1024, format: 'png' }),
                            "text": `Image ${page}/${images.length}`
                        },
                    }
                }, images.length, msg.member, [
                    {
                        emoji: '874406183933444156',
                        reactemoji: '❌',
                        customid: 'delete',
                        style: 'DANGER',
                        function: async (_, __, resultsMsg, collector) => {
                            collector.stop()
                            resultsMsg.delete().catch(() => { })
                        },
                        page: false
                    }
                ], undefined, undefined, undefined, undefined, msg)
            },

            variations: async (msg, args) => {
                if (poopy.functions.lastUrl(msg, 0) === undefined && args[1] === undefined) {
                    await msg.channel.send('What is the file?!').catch(() => { })
                    await msg.channel.sendTyping().catch(() => { })
                    return;
                };
                var currenturl = poopy.functions.lastUrl(msg, 0)
                var fileinfo = await poopy.functions.validateFile(currenturl, true).catch(async error => {
                    await msg.channel.send(error).catch(() => { })
                    await msg.channel.sendTyping().catch(() => { })
                    return;
                })

                if (!fileinfo) return
                var type = fileinfo.type

                if (type.mime.startsWith('image')) {
                    var filepath = await poopy.functions.downloadFile(currenturl, `input.png`, {
                        fileinfo: fileinfo
                    })
                    var filename = 'input.png'
                    
                    await poopy.functions.execPromise(`ffmpeg -i ${filepath}/${filename} -vf "crop=w='min(min(iw,ih),500)':h='min(min(iw,ih),500)',scale=1024:1024,setsar=1" -vframes 1 ${filepath}/output.png`)

                    if (!poopy.modules.fs.existsSync(`${filepath}/output.png`)) return

                    var imageData = poopy.modules.fs.readFileSync(`${filepath}/output.png`)

                    var waitMsg = await msg.channel.send(`Haha... This might take a century`).catch(() => { })

                    var processInterval = setInterval(async () => {
                        await msg.channel.sendTyping().catch(() => { })
                    }, 5000)
                    await msg.channel.sendTyping().catch(() => { })

                    function fail() {
                        clearInterval(processInterval)
                        waitMsg.edit('I failed.').catch(() => { })
                    }

                    async function dalle2Request() {
                        var taskRes = await poopy.modules.axios.request({
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
                                Authorization: `Bearer ${process.env.DALLE2KEY}`
                            }
                        }).catch(() => { })

                        if (!taskRes) {
                            fail()
                            return
                        }

                        var taskId = taskRes.data.id
                        var imageRes

                        while (!imageRes) {
                            await poopy.functions.sleep(20000)

                            var taskCompleteRes = await poopy.modules.axios.request({
                                url: `https://labs.openai.com/api/labs/tasks/${taskId}`,
                                method: 'GET',
                                headers: {
                                    Authorization: `Bearer ${process.env.DALLE2KEY}`
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

                    var images = imageRes.data.generations.data.map(gdata => gdata.generation.image_path)

                    await poopy.functions.navigateEmbed(msg.channel, async (page) => {
                        if (poopy.config.textEmbeds) return `${images[page - 1]}\n\nImage ${page}/${images.length}`
                        else return {
                            "title": `DALL·E 2 generations for ${fileinfo.name}`,
                            "color": 0x472604,
                            "image": {
                                "url": images[page - 1]
                            },
                            "footer": {
                                "icon_url": poopy.bot.user.displayAvatarURL({ dynamic: true, size: 1024, format: 'png' }),
                                "text": `Image ${page}/${images.length}`
                            },
                        }
                    }, images.length, msg.member, [
                        {
                            emoji: '874406183933444156',
                            reactemoji: '❌',
                            customid: 'delete',
                            style: 'DANGER',
                            function: async (_, __, resultsMsg, collector) => {
                                collector.stop()
                                resultsMsg.delete().catch(() => { })
                            },
                            page: false
                        }
                    ], undefined, undefined, undefined, undefined, msg)
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
            }
        }

        if (!args[1]) {
            if (poopy.config.textEmbeds) msg.channel.send("**text2im** <prompt> - Generates 4 images from the text prompt.\n**variations** <image> - Generates 3 variations from the specified image.").catch(() => { })
            else msg.channel.send({
                embeds: [
                    {
                        "title": "Available Options",
                        "description": "**text2im** <prompt> - Generates 4 images from the text prompt.\n**variations** <image> - Generates 3 variations from the specified image.",
                        "color": 0x472604,
                        "footer": {
                            "icon_url": poopy.bot.user.displayAvatarURL({ dynamic: true, size: 1024, format: 'png' }),
                            "text": poopy.bot.user.username
                        },
                    }
                ]
            }).catch(() => { })
            return
        }

        if (!options[args[1].toLowerCase()]) {
            await msg.channel.send('Not a valid option.').catch(() => { })
            return
        }

        await options[args[1].toLowerCase()](msg, args.slice(1))
    },
    help: {
        name: 'dalle2 <option>',
        value: "Allows you to use DALL·E 2! Owner only because credits are very limited. Use the command alone for more info."
    },
    cooldown: 2500,
    type: 'Owner',
    envRequired: ['DALLE2KEY']
}