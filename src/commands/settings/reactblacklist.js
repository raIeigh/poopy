module.exports = {
    name: [
        'reactblacklist',
        'reactionblacklist'
    ],
    args: [{
        name: "option",
        required: false,
        specifarg: false,
        orig: "<option>"
    }],
    subcommands: [{
        name: "list",
        args: [],
        description: "Gets a list of blacklisted reaction channels."
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
        description: "Toggles reaction blacklisting for channels."
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

        if (!msg.guild) {
            await msg.reply("This command can only be used in a server.").catch(() => { })
            return
        }

        data.botData.reactBlacklists ??= {}
        data.botData.reactBlacklists[msg.guild.id] ??= []

        var options = {
            list: async (msg) => {
                let channels = data.botData.reactBlacklists[msg.guild.id] ?? []
                let list = channels.map(id => `- <#${id}>`)

                if (!list.length) list = ['None.']

                let description = list.join('\n')
                let embed = {
                    title: `Reaction-blacklisted channels for ${msg.guild.name}`,
                    description,
                    color: 0x472604,
                    footer: {
                        icon_url: bot.user.displayAvatarURL({
                            dynamic: true, size: 1024, extension: 'png'
                        }),
                        text: bot.user.displayName
                    }
                }

                if (!msg.nosend) {
                    if (config.textEmbeds) {
                        await msg.reply({
                            content: description,
                            allowedMentions: fetchPingPerms(msg)
                        }).catch(() => { })
                    } else {
                        await msg.reply({ embeds: [embed] }).catch(() => { })
                    }
                }

                return description
            },

            toggle: async (msg, args) => {
                if (!(msg.channel.permissionsFor(msg.member).has(DiscordTypes.PermissionFlagsBits.ManageGuild)
                    || msg.channel.permissionsFor(msg.member).has(DiscordTypes.PermissionFlagsBits.ManageMessages)
                    || msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.Administrator)
                    || msg.author.id === msg.guild.ownerId
                    || config.ownerids.includes(msg.author.id))) {
                    await msg.reply('You need to be a moderator to execute that!').catch(() => { })
                    return
                }

                let setOption = getOption(args, 'set', {
                    splice: true, n: 1, join: true
                })

                if (setOption != undefined) {
                    setOption = String(setOption)
                    setOption = ['true', '1'].includes(setOption.toLowerCase()) ? true
                        : ['false', '0'].includes(setOption.toLowerCase()) ? false
                        : undefined

                    if (setOption === undefined) {
                        await msg.reply('The set option must be true or false.').catch(() => { })
                        return
                    }
                }

                let channelIds = []

                for (let i = 2; i < args.length; i++) {
                    let matches = args[i]?.match(/^<#(\d+)>$|^(\d{10,})$/)
                    let channelId = matches ? (matches[1] || matches[2]) : undefined

                    if (channelId && !channelIds.includes(channelId)) {
                        channelIds.push(channelId)
                    }
                }

                if (!channelIds.length) channelIds.push(msg.channel.id)

                let blacklists = data.botData.reactBlacklists[msg.guild.id]
                let added = []
                let removed = []

                for (let channelId of channelIds) {
                    let channel = msg.guild.channels.cache.get(channelId)

                    if (!channel || channel.type == Discord.ChannelType.GuildCategory) continue

                    let index = blacklists.indexOf(channel.id)
                    let shouldBlacklist = setOption !== undefined
                        ? setOption
                        : index === -1

                    if (shouldBlacklist) {
                        if (index === -1) blacklists.push(channel.id)
                        added.push(channel.id)
                    } else {
                        if (index !== -1) blacklists.splice(index, 1)
                        removed.push(channel.id)
                    }
                }

                let results = []

                if (added.length) {
                    results.push(`Blacklisted reactions in ${added.map(id => `<#${id}>`).join(', ')}.`)
                }

                if (removed.length) {
                    results.push(`Removed reaction blacklisting from ${removed.map(id => `<#${id}>`).join(', ')}.`)
                }

                let result = results.length
                    ? results.join('\n')
                    : 'No valid channels were specified.'

                if (!msg.nosend) {
                    await msg.reply({
                        content: result,
                        allowedMentions: fetchPingPerms(msg)
                    }).catch(() => { })
                }

                return result
            }
        }

        if (!args[1]) {
            let instruction =
                '**list** - Gets a list of reaction-blacklisted channels.\n' +
                '**toggle** [channels] [-set <true or false>] (moderator only) - Toggles reaction blacklisting for channels. Without channels, toggles the current channel.'

            if (!msg.nosend) {
                if (config.textEmbeds) {
                    await msg.reply({
                        content: instruction,
                        allowedMentions: fetchPingPerms(msg)
                    }).catch(() => { })
                } else {
                    await msg.reply({
                        embeds: [{
                            title: "Available Options",
                            description: instruction,
                            color: 0x472604,
                            footer: {
                                icon_url: bot.user.displayAvatarURL({
                                    dynamic: true, size: 1024, extension: 'png'
                                }),
                                text: bot.user.displayName
                            }
                        }]
                    }).catch(() => { })
                }
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
        name: 'reactblacklist/reactionblacklist <option>',
        value: 'Allows blacklisting channels from having message reactions added to, unless they are part of a starboard. Use the command alone for more info.'
    },
    cooldown: 5000,
    type: 'Settings'
}