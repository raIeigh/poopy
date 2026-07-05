module.exports = {
    name: [
        'restrict',
        'restrictchannel'
    ],
    args: [{
        name: "option",
        required: true,
        specifarg: false,
        orig: "<option>"
    }],
    subcommands: [{
        name: "list",
        args: [],
        description: "Gets a list of restricted channels."
    },
    {
        name: "toggle",
        args: [{
            name: "channels",
            required: false,
            specifarg: false,
            orig: "[channels]",
            autocomplete: function (interaction) {
                let poopy = this
                let { Discord } = poopy.modules
                
                return interaction.guild.channels.cache
                    .filter(c => c.type != Discord.ChannelType.GuildCategory)
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map(c => ({ name: c.name, value: c.id }))
            }
        },
        {
            name: "set",
            required: false,
            specifarg: false,
            orig: "[-set <true or false>]",
            autocomplete: ["true", "false"]
        }],
        description: "Restricts/unrestricts bot usage in the channels to moderators only."
    }],
    execute: async function (msg, args, opts = {}) {
        let poopy = this
        let data = poopy.data
        let bot = poopy.bot
        let config = poopy.config
        let { DiscordTypes, Discord } = poopy.modules
        let { fetchPingPerms, getOption } = poopy.functions

        if (opts.sourceMsg && msg.author.id != opts.sourceMsg.author.id) {
            await msg.reply("bro").catch(() => { })
            return
        }

        var options = {
            list: async (msg) => {
                var list = []

                data.guildData[msg.guild.id].restricted.forEach(c => {
                    list.push(`- <#${c}>`)
                })

                if (!list.length) {
                    list = ['None.']
                }

                var listEmbed = {
                    title: `List of restricted channels for ${msg.guild.name}`,
                    description: list.join('\n'),
                    color: 0x472604,
                    footer: {
                        icon_url: bot.user.displayAvatarURL({
                            dynamic: true, size: 1024, extension: 'png'
                        }),
                        text: bot.user.displayName
                    }
                }

                if (!msg.nosend) {
                    if (config.textEmbeds) msg.reply({
                        content: list.join('\n'),
                        allowedMentions: fetchPingPerms(msg)
                    }).catch(() => { })
                    else msg.reply({
                        embeds: [listEmbed]
                    }).catch(() => { })
                }
                return list.join('\n')
            },

            toggle: async (msg, args) => {
                if (
                    msg.channel.permissionsFor(msg.member).has(DiscordTypes.PermissionFlagsBits.ManageGuild)
                    || msg.channel.permissionsFor(msg.member).has(DiscordTypes.PermissionFlagsBits.ManageMessages)
                    || msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.Administrator)
                    || msg.author.id === msg.guild.ownerId
                    || (config.ownerids.find(id => id == msg.author.id))
                ) {
                    var setOption = getOption(args, 'set', { splice: true, n: 1, join: true })
                    if (setOption != undefined) {
                        setOption = String(setOption)
                        setOption = ['true', '1'].includes(setOption.toLowerCase()) ? true
                            : ['false', '0'].includes(setOption.toLowerCase()) ? false : undefined
                    }

                    var channelIds = []
                    for (let i = 2; i < args.length; i++) {
                        var channelId = (args[i] && (args[i].match(/[0-9]+/) ?? [])[0]) || msg.channel.id
                        
                        if (!channelIds.includes(channelId))
                            channelIds.push(channelId)
                    }

                    var newRestricted = []
                    var newUnrestricted = []

                    for (let channelId of channelIds) {
                        var findChannel = msg.guild.channels.cache.find(c => c.id === channelId)

                        if (findChannel && findChannel.type != Discord.ChannelType.GuildCategory) {
                            var findChannelIndex = data.guildData[msg.guild.id].restricted.indexOf(channelId)

                            var toRestrict = setOption !== undefined ? setOption
                                : findChannelIndex > -1 ? false : true

                            if (!toRestrict) {
                                if (findChannelIndex > -1)
                                    data.guildData[msg.guild.id].restricted.splice(findChannelIndex, 1)

                                newUnrestricted.push(findChannel.id)
                            } else {
                                if (!(findChannelIndex > -1))
                                    data.guildData[msg.guild.id].restricted.push(findChannel.id)

                                newRestricted.push(findChannel.id)
                            }
                        }
                    }

                    var results = []
                    if (newRestricted.length > 0)
                        results.push(`Restricted ${newRestricted.map(id => `<#${id}>`).join(', ')}.`)
                    if (newUnrestricted.length > 0)
                        results.push(`Unrestricted ${newUnrestricted.map(id => `<#${id}>`).join(', ')}.`)
                    var resultStr = results.length > 0 ? results.join(' ') : 'No valid channels were specified.'

                    if (!msg.nosend) await msg.reply(resultStr)
                    return resultStr
                } else {
                    await msg.reply('You need to be a moderator to execute that!').catch(() => { })
                    return;
                };
            },
        }

        if (!args[1]) {
            var instruction = "**list** - Gets a list of restricted channels.\n"
                + "**toggle** [channels] [-set <true or false>] (moderator only) - Restricts/unrestricts bot usage in the channels to moderators only."
            if (!msg.nosend) {
                if (config.textEmbeds) msg.reply({
                    content: instruction,
                    allowedMentions: fetchPingPerms(msg)
                }).catch(() => { })
                else msg.reply({
                    embeds: [{
                        title: "Available Options",
                        description: instruction,
                        color: 0x472604,
                        footer: {
                            icon_url: bot.user.displayAvatarURL({
                                dynamic: true, size: 1024, extension: 'png'
                            }),
                            text: bot.user.displayName
                        },
                    }]
                }).catch(() => { })
            }

            return instruction
        }

        if (!options[args[1].toLowerCase()]) {
            args.splice(1, 0, "")
            return await options.toggle(msg, args)
        }

        return await options[args[1].toLowerCase()](msg, args)
    },
    help: {
        name: 'restrict/restrictchannel <option>',
        value: 'Restrict bot usage in channels to moderators only. Use the command alone for more info.'
    },
    cooldown: 5000,
    type: 'Settings'
}
