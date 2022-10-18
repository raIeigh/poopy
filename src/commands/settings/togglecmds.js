module.exports = {
    name: [
        'togglecmds',
        'disablecmds',
        'tcommands',
        'togglecommands'],
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

        var options = {
            list: async (msg) => {
                var list = []

                data['guildData'][msg.guild.id]['disabled'].forEach(cmd => {
                    list.push(`- \`${cmd.join('/')}\``)
                })

                if (!list.length) {
                    list = ['None.']
                }

                var listEmbed = {
                    title: `List of disabled commands for ${msg.guild.name}`,
                    description: list.join('\n'),
                    color: 0x472604,
                    footer: {
                        icon_url: bot.user.displayAvatarURL({
                            dynamic: true, size: 1024, format: 'png'
                        }),
                        text: bot.user.username
                    }
                }

                if (config.textEmbeds) msg.reply({
                    content: list.join('\n'),
                    allowedMentions: {
                        parse: ((!msg.member.permissions.has('Administrator') && !msg.member.permissions.has('MentionEveryone') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                    }
                }).catch(() => { })
                else msg.reply({
                    embeds: [listEmbed]
                }).catch(() => { })
            },

            toggle: async (msg, args) => {
                if (msg.member.permissions.has('ManageGuild') || msg.member.permissions.has('ManageMessages') || msg.member.permissions.has('Administrator') || msg.author.id === msg.guild.ownerID || (config.ownerids.find(id => id == msg.author.id))) {
                    if (!args[2]) {
                        await msg.reply('You gotta specify a command!')
                        return
                    }

                    var findCommand = commands.find(cmd => cmd.name.find(n => n === args[2].toLowerCase()))

                    if (findCommand) {
                        var findDCommand = data['guildData'][msg.guild.id]['disabled'].find(cmd => cmd.find(n => n === args[2].toLowerCase()))

                        if (findDCommand) {
                            var index = data['guildData'][msg.guild.id]['disabled'].findIndex(cmd => {
                                return cmd.find(n => {
                                    return n === args[2].toLowerCase()
                                })
                            })

                            data['guildData'][msg.guild.id]['disabled'].splice(index, 1)

                            await msg.reply(`Enabled \`${findCommand.name.join('/')}\`.`)
                        } else {
                            if (findCommand.name.find(n => n === args[0].toLowerCase()) && !data['guildData'][msg.guild.id]['chaos']) {
                                await msg.reply(`You can't disable the disabling command!`)
                                return
                            }

                            data['guildData'][msg.guild.id]['disabled'].push(findCommand.name)

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
                content: "**list** - Gets a list of disabled commands.\n**toggle** <command> (moderator only) - Disables/enables a command, if it exists.",
                allowedMentions: {
                    parse: ((!msg.member.permissions.has('Administrator') && !msg.member.permissions.has('MentionEveryone') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                }
            }).catch(() => { })
            else msg.reply({
                embeds: [{
                    "title": "Available Options",
                    "description": "**list** - Gets a list of disabled commands.\n**toggle** <command> (moderator only) - Disables/enables a command, if it exists.",
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
        name: 'togglecmds/disablecmds/tcommands/togglecommands <option>',
        value: 'Disable or enable commands in your servers. Use the command alone for more info.'
    },
    cooldown: 5000,
    type: 'Settings'
}