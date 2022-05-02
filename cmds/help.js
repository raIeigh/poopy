module.exports = {
    name: ['help', 'commands', 'cmds'],
    execute: async function (msg, args) {
        let poopy = this

        var saidMessage = args.join(' ').substring(args[0].length + 1)
        if (saidMessage) {
            var fCmds = []

            if (saidMessage) poopy.commands.forEach(cmd => {
                if (cmd.name.find(name => name.toLowerCase().includes(saidMessage.toLowerCase()))) {
                    fCmds.push(cmd)
                }
            })
            else fCmds = poopy.commands

            if (fCmds.length) {
                fCmds.sort((a, b) => Math.abs(1 - poopy.functions.similarity(a.name.find(name => name.toLowerCase().includes(saidMessage.toLowerCase())), saidMessage)) - Math.abs(1 - poopy.functions.similarity(b.name.find(name => name.toLowerCase().includes(saidMessage.toLowerCase())), saidMessage)))

                var findCmds = fCmds.map(cmd => {
                    return {
                        title: cmd.help.name,
                        fields: [
                            {
                                "name": "Description",
                                "value": cmd.help.value
                            },
                            {
                                "name": "Cooldown",
                                "value": cmd.cooldown ? `${cmd.cooldown / 1000} seconds` : 'None'
                            },
                            {
                                "name": "Type",
                                "value": cmd.type
                            },
                        ]
                    }
                })

                await poopy.functions.navigateEmbed(msg.channel, async (page) => {
                    if (poopy.config.textEmbeds) return `${fCmds[page - 1].help.name}\n\n**Description:** ${fCmds[page - 1].help.value}\n**Cooldown:** ${fCmds[page - 1].cooldown ? `${fCmds[page - 1].cooldown / 1000} seconds` : 'None'}\n**Type:** ${fCmds[page - 1].type}\n\nCommand ${page}/${findCmds.length}`
                    else return {
                        "title": findCmds[page - 1].title,
                        "color": 0x472604,
                        "footer": {
                            "icon_url": poopy.bot.user.displayAvatarURL({ dynamic: true, size: 1024, format: 'png' }),
                            "text": `Command ${page}/${findCmds.length}`
                        },
                        "fields": findCmds[page - 1].fields,
                    }
                }, findCmds.length, msg.member)
            } else {
                if (poopy.config.textEmbeds) msg.channel.send("No commands match your search.").catch(() => { })
                else msg.channel.send({
                    embeds: [
                        {
                            "description": "No commands match your search.",
                            "color": 0x472604,
                            "footer": {
                                "icon_url": poopy.bot.user.displayAvatarURL({ dynamic: true, size: 1024, format: 'png' }),
                                "text": poopy.bot.user.username
                            },
                        }
                    ]
                }).catch(() => { })
            }
            return
        }
        var jsonid = poopy.config.ownerids.find(id => id == msg.author.id) || poopy.config.jsoning.find(id => id == msg.author.id);
        var ownerid = poopy.config.ownerids.find(id => id == msg.author.id);

        var categoryOptions = {}

        for (var i in poopy.vars.shelpCmds) {
            var shelp = poopy.vars.shelpCmds[i]
            if (categoryOptions[shelp.type] == undefined) {
                categoryOptions[shelp.type] = Number(i) + 1
            }
        }

        var categoriesMenu = Object.keys(categoryOptions).map(cat => {
            return {
                label: cat,
                description: poopy.vars.categories[cat] || '',
                value: cat
            }
        })
        
        var helped = false

        var dmChannel = await msg.author.createDM().catch(() => { })

        if (dmChannel) await poopy.functions.navigateEmbed(dmChannel, async (page) => {
            var helpEmbedText = `**${poopy.vars.shelpCmds[page - 1].type} Commands**\n\n` + "Arguments between \"<>\" are required.\nArguments between \"[]\" are optional.\nArguments between \"{}\" are optional but should normally be supplied.\nMultiple commands can be executed separating them with \"-|-\".\nFile manipulation commands have special options that can be used:\n`-encodingpreset <preset>` - More info in `reencode` command.\n`-filename <name>` - Saves the file as the specified name.\n`-catbox` - Forces the file to be uploaded to catbox.moe.\n`-nosend` - Does not send the file, but stores its catbox.moe URL in the channel's last urls.\n\n" + poopy.vars.shelpCmds[page - 1].commands.map(k => `\`${k.name}\`\n> ${k.value}`).join('\n') + `\n\nPage ${page}/${poopy.vars.shelpCmds.length}`
            var helpEmbed = {
                "title": `${poopy.vars.shelpCmds[page - 1].type} Commands`,
                "description": "Arguments between \"<>\" are required.\nArguments between \"[]\" are optional.\nArguments between \"{}\" are optional but should normally be supplied.\nMultiple commands can be executed separating them with \"-|-\".\nFile manipulation commands have special options that can be used:\n`-encodingpreset <preset>` - More info in `reencode` command.\n`-filename <name>` - Saves the file as the specified name.\n`-catbox` - Forces the file to be uploaded to catbox.moe.\n`-nosend` - Does not send the file, but stores its catbox.moe URL in the channel's last urls.",
                "color": 0x472604,
                "footer": {
                    "icon_url": poopy.bot.user.displayAvatarURL({ dynamic: true, size: 1024, format: 'png' }),
                    "text": `Page ${page}/${poopy.vars.shelpCmds.length}`
                },
                "fields": poopy.vars.shelpCmds[page - 1].commands,
                "menuText": poopy.vars.shelpCmds[page - 1].type
            }
            
            if (helped) {
                helpEmbedText = `**${poopy.vars.shelpCmds[page - 1].type} Commands**\n\n` + poopy.vars.shelpCmds[page - 1].commands.map(k => `\`${k.name}\`\n> ${k.value}`).join('\n') + `\n\nPage ${page}/${poopy.vars.shelpCmds.length}`
                delete helpEmbed.description
            }
            
            helped = true
            
            if (poopy.config.textEmbeds) return helpEmbedText.substring(textEmbedText.length - 2000).replace(new RegExp(poopy.vars.validUrl, 'g'), (url) => `<${url}>`)
            else return helpEmbed
        }, poopy.vars.shelpCmds.length, msg.author.id, poopy.config.useReactions ? [{
            emoji: '🔠',
            reactemoji: '🔠',
            customid: 'category',
            function: async (page) => new Promise(async resolve => {
                var goMessage = await dmChannel.send(`Which category would you like to go... Being case sensitive, we have:\n${Object.keys(categoryOptions).map(c => `- ${c}`).join('\n')}`).catch(() => { })

                var pageCollector = dmChannel.createMessageCollector({ time: 30000 })

                var newpage = page

                pageCollector.on('collect', (m) => {
                    if (!(m.author.id === msg.author.id && ((m.author.id !== poopy.bot.user.id && !m.author.bot) || poopy.config.allowbotusage))) {
                        return
                    }

                    newpage = categoryOptions[m.content] ?? page
                    pageCollector.stop()
                    m.delete().catch(() => { })
                })

                pageCollector.on('end', () => {
                    if (goMessage) goMessage.delete().catch(() => { })
                    resolve(newpage)
                })
            }),
            page: true
        }] : undefined, undefined, !poopy.config.useReactions ? {
            text: 'Select Category',
            customid: 'category',
            options: categoriesMenu,
            function: async (_, option) => categoryOptions[option.values[0]],
            page: true
        } : undefined, true).then(async () => {
            if (jsonid !== undefined) {
                var jsoncmdEmbed = {
                    "title": "JSON Club Commands",
                    "color": 0x472604,
                    "footer": {
                        "icon_url": poopy.bot.user.displayAvatarURL({ dynamic: true, size: 1024, format: 'png' }),
                        "text": poopy.bot.user.username
                    },
                    "fields": poopy.vars.jsonCmds
                };
                if (poopy.config.textEmbeds) await msg.author.send(`**JSON Club Commands**\n\n${poopy.vars.jsonCmds.map(k => `\`${k.name}\`\n> ${k.value}`).join('\n')}`).catch(() => { })
                else await msg.author.send({
                    embeds: [jsoncmdEmbed]
                }).catch(() => { })
            }
            if (ownerid !== undefined) {
                var devcmdEmbed = {
                    "title": "Owner Commands",
                    "color": 0x472604,
                    "footer": {
                        "icon_url": poopy.bot.user.displayAvatarURL({ dynamic: true, size: 1024, format: 'png' }),
                        "text": poopy.bot.user.username
                    },
                    "fields": poopy.vars.devCmds
                };
                if (poopy.config.textEmbeds) await msg.author.send(`**Owner Commands**\n\n${poopy.vars.devCmds.map(k => `\`${k.name}\`\n> ${k.value}`).join('\n')}`).catch(() => { })
                else await msg.author.send({
                    embeds: [devcmdEmbed]
                }).catch(() => { })
            }
            msg.channel.send('✅ Check your DMs.').catch(() => { })
        }).catch((e) => {
            console.log(e)
            msg.channel.send('Couldn\'t send help to you. Do you have me blocked?').catch(() => { })
            return
        })
        else msg.channel.send('Couldn\'t send help to you. Do you have me blocked?').catch(() => { })
    },
    help: {
        name: 'help/commands/cmds [command]',
        value: 'HELP! You can specify the command parameter if you want help on a certain command.'
    },
    cooldown: 2500,
    type: 'Main'
}