module.exports = {
    name: ['managetokens', 'managekeys'],
    args: [{
        "name": "option",
        "required": true,
        "specifarg": false,
        "orig": "<option>"
    }],
    subcommands: [{
        "name": "list",
        "args": [],
        "description": "Gets a list of disabled commands."
    },
    {
        "name": "toggle",
        "args": [{
            "name": "command",
            "required": true,
            "specifarg": false,
            "orig": "<command>",
            "autocomplete": function () {
                let poopy = this
                return poopy.commands.map(cmd => {
                    return { name: cmd.name.join('/'), value: cmd.name[0] }
                })
            }
        }],
        "description": "Disables/enables a command, if it exists."
    }],
    execute: async function (msg, args) {
        let poopy = this
        let data = poopy.data
        let bot = poopy.bot
        let config = poopy.config
        let commands = poopy.commands
        let { CryptoJS } = poopy.modules

        var options = {
            help: async (msg) => {
                if (config.textEmbeds) await dmChannel.send(`> **WHAT are keywords and functions?**\nKeywords and functions are special words that can be used in any command which are replaced with something new (keywords), or generate something new with the arguments inside their parentheses (functions), depending on their purpose. This sort of works like a programming language for the bot.\n\n> **Example Usages**\n\`\`\`\np:say _member really likes _member\n\`\`\`\n\`\`\`\np:img _word\n\`\`\`\n\`\`\`\np:meme4 "lower(_sentence)"\n\`\`\`\n\`\`\`\np:meme4 "lower(_member), the upper(_arab)!"\n\`\`\`\n\`\`\`\np:spam 25 _sayori\n\`\`\`\n\`\`\`\np:say choice(da minion | da bob)\n\`\`\`\n\n> **Command Templates**\n` + "Speech Bubble\n```\ncommand(vmerge | https://cdn.discordapp.com/attachments/760223418968047629/938887195471786034/unknown.png lasturl())\n```\nSquare Crop\n```\ncommand(crop | declare(url | lasturl()) declare(width | width({url})) declare(height | height({url})) declare(biggest | if(equal({width} | {height}) | both | if(bigger({width} | {height}) | width | height))) {url} if(notequal({biggest} | both) | -x if(equal({biggest} | width) | math({width} / 2 - {height} / 2) | 0) -y if(equal({biggest} | height) | math({height} / 2 - {width} / 2) | 0) -w if(equal({biggest} | width) | {height} | {width}) -h if(equal({biggest} |height) | {width} | {height})))\n```\nHerobrine\n```\ncommand(overlay | https://cdn.discordapp.com/attachments/879658786376265768/930909703595253810/herobrines.png lasturl() -origin center bottom -offsetpos -135 -221 -width 30 -height 30 -keepaspectratio increase)\n```").catch(async () => {
                    await msg.reply('Couldn\'t send info to you. Do you have me blocked?').catch(() => { })
                    return
                })
                else await dmChannel.send({
                    embeds: [{
                        "title": 'Manageable Tokens',
                        "color": 0x472604,
                        "footer": {
                            icon_url: bot.user.displayAvatarURL({ dynamic: true, size: 1024, format: 'png' }),
                            text: bot.user.username
                        },
                        "decription": "Here, you can manage your own tokens to freely access APIs without having to deal with the bot's limits! All tokens are encrypted when saved, preventing them from being easily stolen.",
                        "fields": [
                            {
                                "name": "WHAT are keywords and functions?",
                                "value": "Keywords and functions are special words that can be used in any command which are replaced with something new (keywords), or generate something new with the arguments inside their parentheses (functions), depending on their purpose. This sort of works like a programming language for the bot.",
                            },
                            {
                                "name": "Example Usages",
                                "value": "```\np:say _member really likes _member\n```\n```\np:img _word\n```\n```\np:meme4 \"lower(_sentence)\"\n```\n```\np:meme4 \"lower(_member), the upper(_arab)!\"\n```\n```\np:spam 25 _sayori\n```\n```\np:say choice(da minion | da bob)\n```",
                            },
                            {
                                "name": "Templates",
                                "value": "Speech Bubble\n```\ncommand(vmerge | https://cdn.discordapp.com/attachments/760223418968047629/938887195471786034/unknown.png lasturl())\n```\nSquare Crop\n```\ncommand(crop | declare(url | lasturl()) declare(width | width({url})) declare(height | height({url})) declare(biggest | if(equal({width} | {height}) | both | if(bigger({width} | {height}) | width | height))) {url} if(notequal({biggest} | both) | -x if(equal({biggest} | width) | math({width} / 2 - {height} / 2) | 0) -y if(equal({biggest} | height) | math({height} / 2 - {width} / 2) | 0) -w if(equal({biggest} | width) | {height} | {width}) -h if(equal({biggest} |height) | {width} | {height})))\n```\nHerobrine\n```\ncommand(overlay | https://cdn.discordapp.com/attachments/879658786376265768/930909703595253810/herobrines.png lasturl() -origin center bottom -offsetpos -135 -221 -width 30 -height 30 -keepaspectratio increase)\n```"
                            }
                        ]
                    }]
                }).catch(async () => {
                    await msg.reply('Couldn\'t send info to you. Do you have me blocked?').catch(() => { })
                    return
                })
            },

            toggle: async (msg, args) => {
                if (msg.member.permissions.has('MANAGE_GUILD') || msg.member.permissions.has('MANAGE_MESSAGES') || msg.member.permissions.has('ADMINISTRATOR') || msg.author.id === msg.guild.ownerID || (config.ownerids.find(id => id == msg.author.id))) {
                    if (!args[2]) {
                        await msg.reply('You gotta specify a command!')
                        return
                    }

                    var findCommand = commands.find(cmd => cmd.name.find(n => n === args[2].toLowerCase()))

                    if (findCommand) {
                        var findDCommand = data['guild-data'][msg.guild.id]['disabled'].find(cmd => cmd.find(n => n === args[2].toLowerCase()))

                        if (findDCommand) {
                            var index = data['guild-data'][msg.guild.id]['disabled'].findIndex(cmd => {
                                return cmd.find(n => {
                                    return n === args[2].toLowerCase()
                                })
                            })

                            data['guild-data'][msg.guild.id]['disabled'].splice(index, 1)

                            await msg.reply(`Enabled \`${findCommand.name.join('/')}\`.`)
                        } else {
                            if (findCommand.name.find(n => n === args[0].toLowerCase())) {
                                await msg.reply(`You can't disable the disabling command!`)
                                return
                            }

                            data['guild-data'][msg.guild.id]['disabled'].push(findCommand.name)

                            await msg.reply(`Disabled \`${findCommand.name.join('/')}\`.`)
                        }
                    } else {
                        await msg.reply('Not a valid command.')
                        return
                    }
                } else {
                    await msg.reply('You need to be a moderator to execute that!').catch(() => { })
                    return;
                };
            },
        }

        if (!args[1]) {
            if (config.textEmbeds) msg.reply({
                content: "**help** - Get a list of manageable tokens, and how to get them.\n**toggle** <command> (moderator only) - Disables/enables a command, if it exists.",
                allowedMentions: {
                    parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                }
            }).catch(() => { })
            else msg.reply({
                embeds: [{
                    "title": "Available Options",
                    "description": "**help** - Get a list of manageable tokens, and how to get them.\n**toggle** <command> (moderator only) - Disables/enables a command, if it exists.",
                    "color": 0x472604,
                    "footer": {
                        "icon_url": bot.user.displayAvatarURL({
                            dynamic: true, size: 1024, format: 'png'
                        }),
                        "text": bot.user.username
                    },
                }]
            }).catch(() => { })
            return
        }

        if (!options[args[1].toLowerCase()]) {
            await msg.reply('Not a valid option.')
            return
        }

        await options[args[1].toLowerCase()](msg, args)
    },
    help: {
        name: 'managetokens/managekeys <option>',
        value: "**ONLY USE THIS COMMAND IN PRIVATE SERVERS!** Manage tokens for APIs, like remove.bg, Google, and many others. Use the command alone for more info."
    },
    cooldown: 5000,
    type: 'Settings'
}