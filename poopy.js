/** A pooper. */
class Poopy {
    constructor(cfg = {}) {
        // setting up options

        let poopy = this

        // setting values
        let dataValues = require('./src/dataValues')
        let varsList = require('./src/vars')
        let modulesList = require('./src/modules')
        let functionsList = require('./src/functions')

        let config = poopy.config = varsList.defaultConfig

        for (var i in cfg) {
            config[i] = cfg[i]
        }

        let modules = poopy.modules = {}
        let functions = poopy.functions = {}
        let arrays = poopy.arrays = {}
        let callbacks = poopy.callbacks = {}
        let vars = poopy.vars = {}
        let data = poopy.data = {}
        let tempdata = poopy.tempdata = {}
        let globaldata = poopy.globaldata = dataValues.globaldata
        let commands = poopy.commands = []
        let special = poopy.special = {
            keys: {},
            functions: {}
        }

        // undeclared values for other commands
        poopy.activeBots = dataValues.activeBots
        poopy.json = {}
        poopy.tempfiles = {}

        // some vars
        vars.started = false
        vars.msgcooldown = false
        vars.statusChanges = true
        vars.msgcount = 0
        vars.filecount = 0
        vars.cps = 0

        // setting data value trash
        function createPoopyFunction(func) {
            var poopyFunction = func
            var wrappedFunction = function (...args) {
                return poopyFunction.call(poopy, ...args)
            }
            return wrappedFunction
        }

        for (var key in modulesList) {
            var module = modulesList[key]
            modules[key] = module
        }

        for (var key in functionsList) {
            var func = functionsList[key]
            if (func.toString().includes('let poopy = this')) {
                functions[key] = createPoopyFunction(func)
            } else {
                functions[key] = func
            }
        }

        for (var key in varsList) {
            var varb = varsList[key]
            vars[key] = varb
        }

        modules.Discord = modules.Discord[Number(!!config.self)]

        modules.Discord.Util = modules.Discord.Util ?? modules.Discord
        modules.Discord.AttachmentBuilder = modules.Discord.AttachmentBuilder ?? modules.Discord.MessageAttachment

        if (!modules.Discord.ChannelType) {
            modules.Discord.ChannelType = Object.fromEntries(
                Object.entries(modules.DiscordTypes.ChannelType)
                    .filter(([_, val]) => typeof val == "number")
                    .map(([key, val]) => [key, modules.Discord.Constants.ChannelTypes[val]])
            )
        }

        // we can create thge bot now
        let { Discord, DiscordTypes, Collection, fs, CryptoJS } = modules
        let { envsExist, configFlagsEnabled, refreshDiscordURLs, getUploadLimit,
            chunkArray, chunkObject, requireJSON, findCommand, fetchPingPerms,
            dmSupport, msgSupport, sleep, gatherData, deleteMsgData, infoPost, sendWebhook, updateGenAiModel,
            parseKeywords, getUrls, randomChoice, similarity, yesno, chat, autoModContent,
            regexClean, getOption, getTotalHivemindStatus, cleanKeywords } = functions

        let botConfig = {
            partials: [
                Discord.Partials.Channel,
                Discord.Partials.Reaction,
                Discord.Partials.Message,
                Discord.Partials.User,
                Discord.Partials.GuildMember,
                Discord.Partials.ThreadMember
            ],
            failIfNotExists: false
        }

        if (!config.self) {
            botConfig.intents = config.intents
        }

        if (config.allowpresence) {
            botConfig.presence = {
                status: 'idle',
                activities: [
                    {
                        name: 'gathering data...',
                        type: DiscordTypes.ActivityType.Competing
                    }
                ]
            }
        }

        let bot = poopy.bot = new Discord.Client(botConfig)
        if (Discord.REST) poopy.rest = new Discord.REST({
            version: '10'
        })
        poopy.package = JSON.parse(fs.readFileSync('package.json'))

        bot.database = config.database

        fs.readdirSync('src/special/keys').forEach(name => {
            var key = name.replace(/\.js$/, '')
            var keyData = require(`./src/special/keys/${key}`)
            if (!(config.poosonia && config.poosoniakeywordblacklist.find(keyname => keyname == key)) && envsExist(keyData.envRequired ?? []) && configFlagsEnabled(keyData.configRequired ?? []) && !(keyData.configBlacklist && configFlagsEnabled(keyData.configBlacklist))) {
                function keyFunc(...args) {
                    return keyData.func.call(poopy, ...args)
                }

                for (var k in keyData) {
                    keyFunc[k] = keyData[k]
                }

                special.keys[key] = keyFunc
            }
        })

        fs.readdirSync('src/special/functions').forEach(name => {
            var func = name.replace(/\.js$/, '')
            var funcData = require(`./src/special/functions/${name}`)
            if (!(config.poosonia && config.poosoniafunctionblacklist.find(funcname => funcname == func)) && envsExist(funcData.envRequired ?? []) && configFlagsEnabled(funcData.configRequired ?? []) && !(funcData.configBlacklist && configFlagsEnabled(funcData.configBlacklist))) {
                function funcFunc(...args) {
                    return funcData.func.call(poopy, ...args)
                }

                for (var k in funcData) {
                    funcFunc[k] = funcData[k]
                }

                special.functions[func] = funcFunc
            }
        })

        vars.chunkkeyfields = chunkObject(special.keys, 10)
        vars.keyfields = []

        for (var kg in vars.chunkkeyfields) {
            var keygroup = vars.chunkkeyfields[kg]
            vars.keyfields[kg] = []
            for (var k in keygroup) {
                var key = keygroup[k]
                vars.keyfields[kg].push({
                    name: k,
                    value: key.desc
                })
            }
        }

        vars.chunkfuncfields = chunkObject(special.functions, 10)
        vars.funcfields = []

        for (var fg in vars.chunkfuncfields) {
            var funcgroup = vars.chunkfuncfields[fg]
            vars.funcfields[fg] = []
            for (var f in funcgroup) {
                var func = funcgroup[f]
                vars.funcfields[fg].push({
                    name: f + func.helpf,
                    value: func.desc
                })
            }
        }

        fs.readdirSync('src/commands').forEach(category => {
            fs.readdirSync(`src/commands/${category}`).forEach(name => {
                var cmd = name.replace(/\.js$/, '')
                var cmdData = require(`./src/commands/${category}/${name}`)

                if ((config.poosonia && config.poosoniablacklist.find(cmdname => cmdname == cmd)) ||
                    !envsExist(cmdData.envRequired ?? []) ||
                    !configFlagsEnabled(cmdData.configRequired ?? []) ||
                    (cmdData.configBlacklist && configFlagsEnabled(cmdData.configBlacklist))) return

                commands.push(cmdData)
            })
        })

        commands.sort((a, b) => {
            if (a.name[0] > b.name[0]) {
                return 1
            }
            if (a.name[0] < b.name[0]) {
                return -1
            }
            return 0
        })

        arrays.slashBuilders = {}
        arrays.commandGroups = requireJSON(`src/json/commandGroups.json`)

        function findGroup(cmdData) {
            var cmdFind = cmd => typeof cmdData == 'object' ? cmdData.name.find(name => name == cmd) : cmdData == cmd
            var groupFind = group => group.cmds.find(cmdFind)

            return arrays.commandGroups.find(groupFind)
        }

        function addArgs(builder, args) {
            args.forEach(arg =>
                builder.addStringOption(option =>
                    option.setName(arg.name.toLowerCase())
                        .setDescription(arg.orig)
                        .setRequired(arg.required)
                        .setAutocomplete(!!arg.autocomplete)
                )
            )

            builder.addStringOption(option =>
                option.setName('extrapayload')
                    .setDescription('Extra payload you can specify for the command.')
                    .setRequired(false)
            )

            builder.addAttachmentOption(option =>
                option.setName('extraattachment1')
                    .setDescription('Extra attachment you can specify for the command.')
                    .setRequired(false)
            )

            builder.addAttachmentOption(option =>
                option.setName('extraattachment2')
                    .setDescription('Extra attachment you can specify for the command.')
                    .setRequired(false)
            )
        }

        commands.forEach(cmdData => {
            if (config.self) return

            var slashCmd = cmdData.name[0]
            var args = cmdData.args.sort((x, y) => (x.required === y.required) ? 0 : x.required ? -1 : 1)
            var description = cmdData.help.value.match(/[^\n.!?]+[.!?]*/)[0].substring(0, 100)

            var commandGroup = findGroup(cmdData)
            var subcommands = cmdData.subcommands

            if (commandGroup) {
                slashCmd = commandGroup.name
                description = commandGroup.description
            }

            if (arrays.slashBuilders[slashCmd]) return

            var slashBuilder = new Discord.SlashCommandBuilder()

            slashBuilder.setName(slashCmd || "undefined")
                .setDescription(description)

            slashBuilder.integration_types = [0, 1]
            slashBuilder.contexts = [0, 1, 2]

            if (commandGroup) {
                commandGroup.cmds.forEach(cmd => {
                    var fcmdData = findCommand(cmd)

                    if (!fcmdData) {
                        return
                    }

                    var args = fcmdData.args.sort((x, y) => (x.required === y.required) ? 0 : x.required ? -1 : 1)
                    var description = fcmdData.help.value.match(/[^\n.!?]+[.!?]*/)[0].substring(0, 100)

                    slashBuilder.addSubcommand(subcommand => {
                        subcommand
                            .setName(cmd)
                            .setDescription(description)

                        addArgs(subcommand, args)

                        return subcommand
                    })
                })
            } else if (subcommands) {
                subcommands.forEach(subcommand => {
                    var name = subcommand.name
                    var args = subcommand.args.sort((x, y) => (x.required === y.required) ? 0 : x.required ? -1 : 1)
                    var description = subcommand.description.match(/[^\n.!?]+[.!?]*/)[0].substring(0, 100)

                    slashBuilder.addSubcommand(subcommand => {
                        subcommand
                            .setName(name)
                            .setDescription(description)

                        addArgs(subcommand, args)

                        return subcommand
                    })
                })
            } else {
                addArgs(slashBuilder, args)
            }

            arrays.slashBuilders[slashCmd] = slashBuilder
        })

        vars.helpCmds = []
        vars.jsonCmds = []
        vars.tumoreCmds = []
        vars.devCmds = []
        vars.sections = []
        vars.types = ['Local']

        for (var i in commands) {
            var command = commands[i]

            if (command.type === "Owner") {
                vars.devCmds.push(command.help)
            } else if (command.type === "JSON Gang") {
                vars.jsonCmds.push(command.help)
            } else if (command.type === "Tumore") {
                vars.tumoreCmds.push(command.help)
            } else {
                if (!vars.helpCmds.find(typeList => typeList.type === command.type)) {
                    vars.helpCmds.push({
                        type: command.type,
                        commands: []
                    })
                    vars.types.push(command.type)
                }

                vars.helpCmds.find(typeList => typeList.type === command.type).commands.push(command.help)
            }
        }

        vars.helpCmds.sort((a, b) => {
            if (a.type > b.type) {
                return 1
            }
            if (a.type < b.type) {
                return -1
            }
            return 0
        })

        for (var i in vars.helpCmds) {
            var type = vars.helpCmds[i].type

            vars.helpCmds[i].commands.sort((a, b) => {
                if (a.name > b.name) {
                    return 1
                }
                if (a.name < b.name) {
                    return -1
                }
                return 0
            })

            var packed = vars.helpCmds[i].commands

            var chunked = chunkArray(packed, 10)

            for (var j in chunked) {
                var commandChunk = chunked[j]

                vars.sections.push({
                    type: type,
                    commands: commandChunk
                })
            }
        }

        vars.sections.sort((a, b) => {
            if (a.type > b.type) {
                return 1
            }
            if (a.type < b.type) {
                return -1
            }
            return 0
        })

        vars.devCmds.sort((a, b) => {
            if (a.name > b.name) {
                return 1
            }
            if (a.name < b.name) {
                return -1
            }
            return 0
        })

        vars.jsonCmds.sort((a, b) => {
            if (a.name > b.name) {
                return 1
            }
            if (a.name < b.name) {
                return -1
            }
            return 0
        })

        vars.shelpCmds = vars.sections

        callbacks.messageCallbacks = [async (msg) => {
            dmSupport(msg)

            var origcontent = msg.content
            if (!msg.user || !msg.author) return

            data.botData.messages++

            var dataError = false
            await gatherData(msg).catch((err) => dataError = err)
            if (dataError) return console.log(dataError)

            var prefix = data.guildData[msg.guild.id]?.prefix ?? config.globalPrefix
            var hivemind = data.guildData[msg.guild.id].poopymode ? "All" : "One"

            if (
                msg.channel instanceof Discord.BaseChannel &&
                msg.channel.type == Discord.ChannelType.DM &&
                msg.type !== DiscordTypes.InteractionType.ApplicationCommand &&
                !origcontent.toLowerCase().includes(prefix.toLowerCase())
            ) {
                if (msg.author.bot || msg.author.id == bot.user.id || tempdata[msg.guild?.id]?.[msg.channel?.id]?.shutUp) return
                msg.channel.sendTyping().catch(() => { })
                await sleep(Math.floor(Math.random() * 500) + 500)
                await msg.channel.send(arrays.dmPhrases[Math.floor(Math.random() * arrays.dmPhrases.length)]
                    .replace(/{mention}/g, msg.author.toString())).catch(() => { })
                return
            }

            if (!config.ownerids.find(id => id == msg.author.id) && config.testing && !config.allowtesting) {
                await msg.reply('you won\'t use me any time soon')
                return
            }

            var guildfilter = config.guildfilter
            var channelfilter = config.channelfilter

            var isFiltered = (guildfilter.blacklist && guildfilter.ids.includes(msg.guild.id)) ||
                (
                    !(guildfilter.blacklist) &&
                    !(guildfilter.ids.includes(msg.guild.id))
                ) ||
                (
                    channelfilter.gids.includes(msg.guild.id) &&
                    (
                        (channelfilter.blacklist && channelfilter.ids.some(
                            id => id == msg.channel?.id || id == msg.channel?.parent?.id || id == msg.channel?.parent?.parent?.id
                        )) ||
                        (!(channelfilter.blacklist) && !(channelfilter.ids.some(
                            id => id == msg.channel?.id || id == msg.channel?.parent?.id || id == msg.channel?.parent?.parent?.id
                        )))
                    )
                )

            if (
                !msg.guild ||
                !msg.channel ||
                tempdata[msg.guild.id][msg.channel.id].shutUp ||
                isFiltered
            ) {
                deleteMsgData(msg)
                return
            }

            var webhook = msg.webhookId || (msg.author.bot && !msg.author.flags)

            if (webhook || !msg.guild || !msg.channel) {
                deleteMsgData(msg)
                return
            }

            if (data.guildData[msg.guild.id].chaos && globaldata.shit.find(id => id === msg.author.id)) {
                await msg.reply('shit').catch(() => { })
                return
            }

            var bypassPerms = (
                msg.channel?.permissionsFor(msg.member)?.has(DiscordTypes.PermissionFlagsBits.ManageGuild) ||
                msg.channel?.permissionsFor(msg.member)?.has(DiscordTypes.PermissionFlagsBits.ManageMessages) ||
                msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.Administrator) ||
                msg.author.id === msg.guild.ownerId ||
                (config.ownerids.find(id => id == msg.author.id))
            )

            var cmds = data.guildData[msg.guild.id].chaincommands || bypassPerms
                ? origcontent.split(/\s*-\|-\s*/) : [origcontent]
            var allcontents = []
            var webhooked = false
            var collected = false

            var isRestricted = data.guildData[msg.guild.id].restricted.some(
                id => id == msg.channel?.id || id == msg.channel?.parent?.id || id == msg.channel?.parent?.parent?.id
            ) && !bypassPerms

            async function webhookify() {
                webhooked = true

                var customHook = data.guildData[msg.guild.id].channels[msg.channel.id].custom[msg.author.id] ??
                    data.guildData[msg.guild.id].members[msg.author.id].custom

                if (
                    msg.type === DiscordTypes.InteractionType.ApplicationCommand ||
                    !(origcontent || msg.attachments.size || msg.embeds.length || msg.stickers.size) ||
                    !(
                        customHook ||
                        data.guildData[msg.guild.id].members[msg.author.id].impostor ||
                        data.guildData[msg.guild.id].channels[msg.channel.id].battling
                    )
                ) {
                    return
                }

                var attachments = msg.attachments
                    .filter(attachment => attachment.size <= getUploadLimit(msg))
                    .map(attachment => new Discord.AttachmentBuilder(attachment.url, attachment.name))
                var embeds = msg.embeds.filter(embed => embed.data.type === 'rich')
                var stickers = msg.stickers
                    .filter(sticker => sticker.format != 3)
                    .map(sticker => new Discord.AttachmentBuilder(`${sticker.url.replace("cdn.discordapp.com", "media.discordapp.net")}?size=160`))

                var attachmentsAndStickers = attachments.concat(stickers)

                var sendObject = {
                    username: msg.member.displayName,
                    content: origcontent || "",
                    files: data.guildData[msg.guild.id].webhookAttachments ? attachmentsAndStickers : [],
                    embeds: embeds,
                    allowedMentions: msg.author.id == bot.user.id ? { parse: [] } : fetchPingPerms(msg)
                }

                if (msg.reference && !msg.messageSnapshots?.size) {
                    const referenceMsg = await msg.fetchReference().catch(() => { })
                    if (referenceMsg) {
                        const replyMention = msg.mentions.members.find(member => member.user.id === referenceMsg.author.id) ? ` (${referenceMsg.author.toString()})` : ""
                        sendObject.content = `> -# Reply to: ${referenceMsg.url}${replyMention}\n${sendObject.content ?? ""}`
                    }
                }

                if (!data.guildData[msg.guild.id].webhookAttachments) {
                    sendObject.content += `\n${attachmentsAndStickers.map(attachment => attachment.attachment).join(" ")}`
                }

                sendObject.content = sendObject.content.trim().substring(0, 2000)

                if (data.guildData[msg.guild.id].members[msg.author.id].impostor) {
                    sendObject.avatarURL = 'https://cdn.discordapp.com/attachments/760223418968047629/835923486668750888/imposter.jpg'
                }

                if (data.guildData[msg.guild.id].channels[msg.channel.id].battling) {
                    var battlingTypes = [
                        "disabled",
                        "battlers",
                        "enemies",
                        "all",
                        "deltarune",
                        "undertale",
                        "utdr"
                    ]
                    
                    var battlingJSONs = {
                        battlers: [poopy.json.battlerJSON.battlers],
                        enemies: [poopy.json.battlerJSON.enemies],
                        all: [poopy.json.battlerJSON.battlers, poopy.json.battlerJSON.enemies],
                        deltarune: [poopy.json.utdrJSON.deltarune],
                        undertale: [poopy.json.utdrJSON.undertale],
                        utdr: [poopy.json.utdrJSON.undertale, poopy.json.utdrJSON.deltarune]
                    }
                    
                    var battlingValue = data.guildData[msg.guild.id].channels[msg.channel.id].battling
                    var type = battlingTypes[battlingValue]

                    var battlers = [].concat(...(battlingJSONs[type] ?? []))
                        .filter(b => !b.custom || (b.custom && b.ignoreCustomBlacklist))

                    var battler = battlers.find(battler => battler.custom && battler.custom.some(id => id == msg.author.id)) ??
                        battlers.reduce((closestBattler, currentBattler) =>
                            similarity(currentBattler.name ?? "", msg.member.displayName ?? msg.author.displayName ?? "")
                                > similarity(closestBattler.name ?? "", msg.member.displayName ?? msg.author.displayName ?? "")
                                ? currentBattler : closestBattler
                        )

                    sendObject.username = battler.name
                    sendObject.avatarURL = battler.image
                }

                if (customHook) {
                    sendObject.username = customHook.name.substring(0, 32)
                    sendObject.avatarURL = customHook.avatar
                }

                await sendWebhook(msg, sendObject).catch((e) => console.log(e))
                msg.delete().catch(() => { })
            }

            async function executeCommand() {
                var executed = false
                var localExecuted = false

                for (var i in cmds) {
                    var cmd = cmds[i]

                    msg.oldcontent = cmd

                    if (
                        !config.poosonia &&
                        (
                            data.guildData[msg.guild.id].keyexec == 2 ||
                            (data.guildData[msg.guild.id].keyexec == 1 && cmd.toLowerCase().startsWith(prefix.toLowerCase()))
                        ) && !commands.find(
                            c => c.raw &&
                                c.name.find(n => cmd.toLowerCase().startsWith(`${prefix.toLowerCase()}${n.toLowerCase()}`))
                        ) &&
                        ((!msg.author.bot && msg.author.id != bot.user.id) || config.allowbotusage)
                    ) {
                        var change = await parseKeywords(cmd, msg, false, { resetAttempts: true }).catch(async err => {
                            await msg.reply({
                                content: err.stack,
                                allowedMentions: fetchPingPerms(msg)
                            }).catch(() => { })
                        }) ?? 'error'

                        msg.content = origcontent = change
                    } else {
                        msg.content = origcontent = cmd
                    }

                    if (!msg.guild || !msg.channel) {
                        return
                    }

                    allcontents.push(origcontent)

                    if (allcontents.length >= cmds.length && !webhooked) {
                        var content = origcontent
                        msg.content = origcontent = allcontents.join(' -|- ')
                        await webhookify().catch((e) => console.log(e))
                        msg.content = origcontent = content
                    }

                    await getUrls(msg, {
                        update: true,
                        string: origcontent
                    }).catch(async err => {
                        try {
                            await msg.reply({
                                content: err.stack,
                                allowedMentions: fetchPingPerms(msg)
                            }).catch(() => { })
                        } catch (_) { }
                    })

                    if (tempdata[msg.guild.id][msg.channel.id].shutUp) break

                    if (!collected && msg.type != DiscordTypes.InteractionType.ApplicationCommand) {
                        collected = true
                        tempdata.collectors.filter(
                            c => c?.id && c?.id.startsWith(msg.channel.id) && c?.type == "message"
                        ).forEach(collector => collector.collect(msg))
                    }

                    if (origcontent.toLowerCase().startsWith(prefix.toLowerCase()) && !isRestricted && ((!msg.author.bot && msg.author.id != bot.user.id) || config.allowbotusage)) {
                        data.guildData[msg.guild.id].lastuse = Date.now()
                        data.guildData[msg.guild.id].channels[msg.channel.id].lastuse = Date.now()

                        var hivemindPass = true

                        if (process.env.HIVEMIND_ID && config.hivemind && !data.guildData[msg.guild.id].poopymode) {
                            await getTotalHivemindStatus().then(totalStatus => {
                                var first = totalStatus[0].id == process.env.HIVEMIND_ID

                                if (!first) {
                                    hivemindPass = false
                                }
                            })
                        }

                        if (!msg.channel.permissionsFor(msg.guild.members.me).has(DiscordTypes.PermissionFlagsBits.SendMessages, false)) {
                            executed = true
                            if (hivemindPass) {
                                var emojis = msg.guild.emojis.cache.filter(emoji => !config.self ? emoji.available : emoji.available && !emoji.animated).map(emoji => emoji.toString())
                                await msg.react(randomChoice(emojis)).catch(() => { })
                            }
                        }

                        if (tempdata[msg.author.id].rateLimited) {
                            executed = true

                            var totalSeconds = (tempdata[msg.author.id].rateLimited - Date.now()) / 1000
                            var days = Math.floor(totalSeconds / 86400);
                            totalSeconds %= 86400;
                            var hours = Math.floor(totalSeconds / 3600);
                            totalSeconds %= 3600;
                            var minutes = Math.floor(totalSeconds / 60);
                            var seconds = totalSeconds % 60
                            var times = []

                            if (days) times.push(days)
                            if (hours) times.push(hours)
                            if (minutes) times.push(minutes)
                            if (seconds) times.push(seconds)

                            if (hivemindPass) {
                                await msg.reply(`You are being rate limited. (\`${times.join(':')}\`)`).catch(() => { })
                            }
                            return
                        }

                        if (globaldata.shit.find(id => id === msg.author.id)) {
                            executed = true
                            if (hivemindPass) {
                                await msg.reply('shit').catch(() => { })
                            }
                            return
                        }

                        if (data.guildData[msg.guild.id].members[msg.author.id].coolDown) {
                            if ((data.guildData[msg.guild.id].members[msg.author.id].coolDown - Date.now()) > 0 &&
                                tempdata[msg.author.id].coolDownMsg !== msg.id) {
                                if (hivemindPass) {
                                    await msg.reply(`Calm down! Wait more ${(data.guildData[msg.guild.id].members[msg.author.id].coolDown - Date.now()) / 1000} seconds.`).catch(() => { })
                                }
                                return
                            } else {
                                data.guildData[msg.guild.id].members[msg.author.id].coolDown = false
                                delete tempdata[msg.author.id].coolDownMsg
                            }
                        }

                        tempdata[msg.author.id].coolDownMsg = msg.id

                        var args = origcontent.substring(prefix.toLowerCase().length).split(' ')
                        var findCmd = findCommand(args[0].toLowerCase())
                        var findLocalCmd = data.guildData[msg.guild.id].localcmds.find(cmd => cmd.name === args[0].toLowerCase())
                        var similarCmds = []

                        for (var i in commands) {
                            var fcmd = commands[i]
                            for (var j in fcmd.name) {
                                var fcmdname = fcmd.name[j]
                                similarCmds.push({
                                    name: fcmd.name[j],
                                    type: 'cmd',
                                    similarity: similarity(fcmdname, args[0].toLowerCase())
                                })
                            }
                        }

                        for (var i in data.guildData[msg.guild.id].localcmds) {
                            var fcmd = data.guildData[msg.guild.id].localcmds[i]
                            similarCmds.push({
                                name: fcmd.name,
                                type: 'local',
                                similarity: similarity(fcmd.name, args[0].toLowerCase())
                            })
                        }

                        similarCmds.sort((a, b) => Math.abs(1 - a.similarity) - Math.abs(1 - b.similarity))

                        if (findCmd) {
                            executed = true
                            if (!hivemindPass) {
                                if (findCmd.hivemindForce) {
                                    msg.nosend = true
                                } else return
                            }

                            var isDisabled = data.guildData[msg.guild.id].disabled.find(cmd => cmd.find(n => n === args[0].toLowerCase())) && !bypassPerms
                            if (isDisabled) {
                                await msg.reply('This command is disabled in this server.').catch(() => { })
                            } else {
                                var increaseCount = !(/sendFile|if \(!msg.nosend\)/.test(findCmd.execute.toString()) && !msg.replied && msg.nosend)

                                if (increaseCount) {
                                    if (
                                        tempdata[msg.author.id][msg.id]?.execCount >= 1 &&
                                        !data.guildData[msg.guild.id].chaincommands &&
                                        !bypassPerms
                                    ) {
                                        await msg.reply('You can\'t chain commands in this server.').catch(() => { })
                                        return
                                    }

                                    if (tempdata[msg.author.id][msg.id]?.execCount >= config.commandLimit * ((msg.channel.permissionsFor(msg.member).has(DiscordTypes.PermissionFlagsBits.ManageGuild) || msg.channel.permissionsFor(msg.member).has(DiscordTypes.PermissionFlagsBits.ManageMessages) || msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.Administrator) || msg.author.id === msg.guild.ownerId) ? 5 : 1)) {
                                        await msg.reply(`Number of commands to run at the same time must be smaller or equal to **${config.commandLimit * ((msg.channel.permissionsFor(msg.member).has(DiscordTypes.PermissionFlagsBits.ManageGuild) || msg.channel.permissionsFor(msg.member).has(DiscordTypes.PermissionFlagsBits.ManageMessages) || msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.Administrator) || msg.author.id === msg.guild.ownerId) ? 5 : 1)}**!`).catch(() => { })
                                        return
                                    }

                                    if (!data.guildData[msg.guild.id].chaos && tempdata[msg.author.id][msg.id]) tempdata[msg.author.id][msg.id].execCount++
                                }

                                if (findCmd.cooldown) {
                                    data.guildData[msg.guild.id].members[msg.author.id].coolDown = (data.guildData[msg.guild.id].members[msg.author.id].coolDown || Date.now()) + findCmd.cooldown / ((msg.channel.permissionsFor(msg.member).has(DiscordTypes.PermissionFlagsBits.ManageGuild) || msg.channel.permissionsFor(msg.member).has(DiscordTypes.PermissionFlagsBits.ManageMessages) || msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.Administrator) || msg.author.id === msg.guild.ownerId) && (findCmd.type === 'Text' || findCmd.type === 'Main') ? 5 : 1)
                                }

                                delete msg.nosend
                                msg.nosend = getOption(args, 'nosend', { n: 0, splice: true, dft: false })

                                vars.cps++
                                data.botData.commands++
                                var t = setTimeout(() => {
                                    vars.cps--
                                    clearTimeout(t)
                                }, 60000)
                                infoPost(`Command \`${args[0].toLowerCase()}\` used`)
                                await findCmd.execute.call(poopy, msg, args, {}).catch(async err => {
                                    try {
                                        await msg.reply({
                                            content: err.stack,
                                            allowedMentions: fetchPingPerms(msg)
                                        }).catch(() => { })
                                    } catch (_) { }
                                })
                                data.botData.filecount = vars.filecount
                            }
                        } else if (findLocalCmd) {
                            executed = true

                            if (!hivemindPass) {
                                if (findLocalCmd.hivemindForce) {
                                    msg.nosend = true
                                } else return
                            }

                            vars.cps++
                            data.botData.commands++
                            var t = setTimeout(() => {
                                vars.cps--
                                clearTimeout(t)
                            }, 60000)
                            infoPost(`Command \`${args[0].toLowerCase()}\` used`)
                            var phrase = await parseKeywords(findLocalCmd.phrase, msg, true, { resetAttempts: true, ownermode: findLocalCmd.ownermode }).catch((e) => console.log(e)) ?? 'error'

                            var increaseCount = !!phrase.trim()

                            if (increaseCount) {
                                if (
                                    tempdata[msg.author.id][msg.id]?.execCount >= 1 &&
                                    !data.guildData[msg.guild.id].chaincommands &&
                                    !bypassPerms && !localExecuted
                                ) {
                                    await msg.reply('You can\'t chain commands in this server.').catch(() => { })
                                    return
                                }

                                if (tempdata[msg.author.id][msg.id]?.execCount >= config.commandLimit * ((msg.channel.permissionsFor(msg.member).has(DiscordTypes.PermissionFlagsBits.ManageGuild) || msg.channel.permissionsFor(msg.member).has(DiscordTypes.PermissionFlagsBits.ManageMessages) || msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.Administrator) || msg.author.id === msg.guild.ownerId) ? 5 : 1)) {
                                    await msg.reply(`Number of commands to run at the same time must be smaller or equal to **${config.commandLimit * ((msg.channel.permissionsFor(msg.member).has(DiscordTypes.PermissionFlagsBits.ManageGuild) || msg.channel.permissionsFor(msg.member).has(DiscordTypes.PermissionFlagsBits.ManageMessages) || msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.Administrator) || msg.author.id === msg.guild.ownerId) ? 5 : 1)}**!`).catch(() => { })
                                    return
                                }

                                if (!data.guildData[msg.guild.id].chaos && tempdata[msg.author.id][msg.id]) tempdata[msg.author.id][msg.id].execCount++
                            }

                            localExecuted = true
                            if (tempdata[msg.guild.id][msg.channel.id].shutUp) break

                            await msg.reply({
                                content: phrase,
                                allowedMentions: fetchPingPerms(msg)
                            }).catch(() => { })

                            data.botData.filecount = vars.filecount
                        } else if (similarCmds ? similarCmds.find(fcmd => fcmd.similarity >= 0.5) : undefined) {
                            executed = true
                            var useCmd = await yesno(msg.channel, `Did you mean to use \`${similarCmds[0].name}\`?`, msg.author.id, undefined, msg).catch(() => { })
                            if (useCmd) {
                                if (similarCmds[0].type === 'cmd') {
                                    var isDisabled = data.guildData[msg.guild.id].disabled.find(cmd => cmd.find(n => n === similarCmds[0].name)) && !bypassPerms

                                    if (isDisabled && hivemindPass) {
                                        await msg.reply('This command is disabled in this server.').catch(() => { })
                                    } else {
                                        var findCmd = findCommand(similarCmds[0].name)

                                        if (!hivemindPass) {
                                            if (findCmd.hivemindForce) {
                                                msg.nosend = true
                                            } else return
                                        }

                                        var increaseCount = !(/sendFile|if \(!msg.nosend\)/.test(findCmd.execute.toString()) && !msg.replied && msg.nosend)

                                        if (increaseCount) {
                                            if (
                                                tempdata[msg.author.id][msg.id]?.execCount >= 1 &&
                                                !data.guildData[msg.guild.id].chaincommands &&
                                                !bypassPerms
                                            ) {
                                                await msg.reply('You can\'t chain commands in this server.').catch(() => { })
                                                return
                                            }

                                            if (tempdata[msg.author.id][msg.id]?.execCount >= config.commandLimit * ((msg.channel.permissionsFor(msg.member).has(DiscordTypes.PermissionFlagsBits.ManageGuild) || msg.channel.permissionsFor(msg.member).has(DiscordTypes.PermissionFlagsBits.ManageMessages) || msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.Administrator) || msg.author.id === msg.guild.ownerId) ? 5 : 1)) {
                                                await msg.reply(`Number of commands to run at the same time must be smaller or equal to **${config.commandLimit * ((msg.channel.permissionsFor(msg.member).has(DiscordTypes.PermissionFlagsBits.ManageGuild) || msg.channel.permissionsFor(msg.member).has(DiscordTypes.PermissionFlagsBits.ManageMessages) || msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.Administrator) || msg.author.id === msg.guild.ownerId) ? 5 : 1)}**!`).catch(() => { })
                                                return
                                            }

                                            if (!data.guildData[msg.guild.id].chaos && tempdata[msg.author.id][msg.id]) tempdata[msg.author.id][msg.id].execCount++
                                        }

                                        if (findCmd.cooldown) {
                                            data.guildData[msg.guild.id].members[msg.author.id].coolDown = (data.guildData[msg.guild.id].members[msg.author.id].coolDown || Date.now()) + findCmd.cooldown / ((msg.channel.permissionsFor(msg.member).has(DiscordTypes.PermissionFlagsBits.ManageGuild) || msg.channel.permissionsFor(msg.member).has(DiscordTypes.PermissionFlagsBits.ManageMessages) || msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.Administrator) || msg.author.id === msg.guild.ownerId) && (findCmd.type === 'Text' || findCmd.type === 'Main') ? 5 : 1)
                                        }

                                        vars.cps++
                                        data.botData.commands++
                                        var t = setTimeout(() => {
                                            vars.cps--
                                            clearTimeout(t)
                                        }, 1000)
                                        infoPost(`Command \`${similarCmds[0].name}\` used`)
                                        await findCmd.execute.call(poopy, msg, args, {}).catch(async err => {
                                            try {
                                                await msg.reply({
                                                    content: err.stack,
                                                    allowedMentions: fetchPingPerms(msg)
                                                }).catch(() => { })
                                                msg.channel.sendTyping().catch(() => { })
                                            } catch (_) { }
                                        })
                                        data.botData.filecount = vars.filecount
                                    }
                                } else if (similarCmds[0].type === 'local') {
                                    var findLocalCmd = data.guildData[msg.guild.id].localcmds.find(cmd => cmd.name === similarCmds[0].name)
                                    if (!hivemindPass) {
                                        if (findLocalCmd.hivemindForce) {
                                            msg.nosend = true
                                        } else return
                                    }

                                    vars.cps++
                                    data.botData.commands++
                                    var t = setTimeout(() => {
                                        vars.cps--
                                        clearTimeout(t)
                                    }, 60000)
                                    infoPost(`Command \`${similarCmds[0].name}\` used`)
                                    var phrase = findLocalCmd ? (await parseKeywords(findLocalCmd.phrase, msg, true, { resetAttempts: true, ownermode: findLocalCmd.ownermode }).catch((e) => console.log(e)) ?? 'error') : 'error'

                                    var increaseCount = !!phrase.trim()

                                    if (increaseCount) {
                                        if (
                                            tempdata[msg.author.id][msg.id]?.execCount >= 1 &&
                                            !data.guildData[msg.guild.id].chaincommands &&
                                            !bypassPerms && !localExecuted
                                        ) {
                                            await msg.reply('You can\'t chain commands in this server.').catch(() => { })
                                            return
                                        }

                                        if (tempdata[msg.author.id][msg.id]?.execCount >= config.commandLimit * ((msg.channel.permissionsFor(msg.member).has(DiscordTypes.PermissionFlagsBits.ManageGuild) || msg.channel.permissionsFor(msg.member).has(DiscordTypes.PermissionFlagsBits.ManageMessages) || msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.Administrator) || msg.author.id === msg.guild.ownerId) ? 5 : 1)) {
                                            await msg.reply(`Number of commands to run at the same time must be smaller or equal to **${config.commandLimit * ((msg.channel.permissionsFor(msg.member).has(DiscordTypes.PermissionFlagsBits.ManageGuild) || msg.channel.permissionsFor(msg.member).has(DiscordTypes.PermissionFlagsBits.ManageMessages) || msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.Administrator) || msg.author.id === msg.guild.ownerId) ? 5 : 1)}**!`).catch(() => { })
                                            return
                                        }

                                        if (!data.guildData[msg.guild.id].chaos && tempdata[msg.author.id][msg.id]) tempdata[msg.author.id][msg.id].execCount++
                                    }

                                    localExecuted = true
                                    if (tempdata[msg.guild.id][msg.channel.id].shutUp) return

                                    await msg.reply({
                                        content: phrase,
                                        allowedMentions: fetchPingPerms(msg)
                                    }).catch(() => { })

                                    data.botData.filecount = vars.filecount
                                }
                            }
                        }
                    }
                }

                return executed
            }

            var executed = await executeCommand().catch(async (e) => await msg.reply({
                content: e.stack,
                allowedMentions: fetchPingPerms(msg)
            }).catch(() => { }))

            msg.content = origcontent = allcontents.length > 0 ? allcontents.join(' -|- ') : origcontent

            if (!webhooked) await webhookify().catch((e) => console.log(e))

            if (!collected && msg.type != DiscordTypes.InteractionType.ApplicationCommand) {
                collected = true
                tempdata.collectors.filter(
                    c => c?.id && c?.id?.startsWith(msg.channel.id) && c?.type == "message"
                ).forEach(collector => collector.collect(msg))
                
                tempdata.collectors.filter(
                    c => c.id === undefined || c.type === undefined
                ).forEach(collector => {
                    console.log('what has happened')
                    console.log(collector)
                })
            }

            if (
                origcontent && ((!(msg.author.bot) && msg.author.id != bot.user.id) || config.allowbotusage)
                && data.guildData[msg.guild?.id]?.read?.some(
                    id => id == msg.channel?.id || id == msg.channel?.parent?.id || id == msg.channel?.parent?.parent?.id
                )
            ) {
                var cleanMessage = cleanKeywords(msg.content, msg) // cleanContentPreserveEmojis(origcontent, msg.channel).replace(/\@/g, '@‌')

                if (
                    !(tempdata[msg.guild.id].messages.some(message => message.content.toLowerCase() === cleanMessage.toLowerCase()))
                ) {
                    data.guildData[msg.guild.id].messages.unshift({
                        id: msg.id,
                        author: msg.author.id,
                        content: CryptoJS.AES.encrypt(cleanMessage, process.env.AUTH_TOKEN).toString(),
                        timestamp: Date.now()
                    })

                    tempdata[msg.guild.id].messages.unshift({
                        id: msg.id,
                        author: msg.author.id,
                        content: cleanMessage,
                        timestamp: Date.now()
                    })

                    updateGenAiModel(msg, {
                        sample: cleanMessage
                    })
                }
            }

            deleteMsgData(msg)

            if (!msg.guild || !msg.channel || tempdata[msg.guild.id][msg.channel.id].shutUp || isRestricted) {
                return
            }

            var hasTriggerPhrase = config.triggerPhrase && origcontent.toLowerCase().match(config.triggerPhrase.toLowerCase())

            if (hasTriggerPhrase && (!msg.author.bot || (config.allowbottriggers || config.allowbotusage))) {
                var content = randomChoice(arrays.eightball)
                if (msg.author.id == bot.user.id) {
                    await msg.channel.send(content).catch(() => { })
                } else {
                    await msg.reply(content).catch(() => { })
                }
            } else if (
                config.allowpingresponses &&
                msg.mentions.members.find(member => member.user.id === bot.user.id) && (
                    (!msg.author.bot && msg.author.id != bot.user.id) ||
                    config.allowbotusage
                ) && !executed
            ) {
                var eggPhrasesHivemind = poopy.json.eggphraseJSON.hivemind
                var eggPhrases = poopy.json.eggphraseJSON.normal

                var ourEggPhrases = (process.env.HIVEMIND_ID && config.hivemind) ? eggPhrasesHivemind : eggPhrases
                ourEggPhrases = ourEggPhrases.map(
                    p => p.replace(/\{prefix\}/g, prefix).replace(/\{hivemind\}/g, hivemind)
                )

                var lastMention = Date.now() - (tempdata[msg.author.id].lastMention || Date.now())
                if (lastMention > config.pingresponsecooldown) tempdata[msg.author.id].mentions = 0

                tempdata[msg.author.id].lastMention = Date.now()

                if (isNaN(tempdata[msg.author.id].mentions)) tempdata[msg.author.id].mentions = 0
                tempdata[msg.author.id].mentions++

                if (config.pingresponselimit && tempdata[msg.author.id].mentions >= config.pingresponselimit) {
                    if (tempdata[msg.author.id].mentions == config.pingresponselimit) await msg.reply("Don't RIZZ me. Don't come by OHIO. We're DONE.").catch(() => { })
                    return
                }

                var words = origcontent.toLowerCase().split(/\s+/g)

                // else if else if selselaesl seif sia esla fiwsa eaisf afis asifasfd
                if (msg.reference) {
                    const channelData = tempdata[msg.channel.guild?.id]?.[msg.channel.id]

                    var forceres = channelData?.forceResponse
                    if (forceres && forceres.repliesOnly) {
                        delete channelData.forceResponse

                        var res = await parseKeywords(forceres.res, msg, true, {
                            resetAttempts: true,
                            extraKeys: {
                                _msg: {
                                    func: async () => {
                                        return msg.content
                                    }
                                }
                            }
                        }).catch(() => { }) ?? forceres.res

                        if (forceres.persist && !channelData.forceResponse) channelData.forceResponse = forceres

                        if (res) {
                            await msg.reply({
                                content: res,
                                allowedMentions: fetchPingPerms(msg)
                            }).catch(() => { })
                        }
                    } else {
                        var eightballMsg = randomChoice(arrays.eightball)
                        var resp = !process.env.AI21_KEY || (data.guildData[msg.guild.id]?.disabled
                            .find(cmd => cmd.find(n => n === "chat")) && !bypassPerms) ?
                            eightballMsg :
                            await chat(origcontent, msg, {
                                errorMsg: eightballMsg
                            }).catch(() => { }) ?? "what"

                        if (resp) {
                            await msg.reply({
                                content: resp,
                                allowedMentions: fetchPingPerms(msg)
                            }).catch(() => { })
                        }
                    }
                } else if (words.includes('prefix') && words.includes('reset')) {
                    var findCmd = findCommand('setprefix')

                    if (findCmd.cooldown) {
                        data.guildData[msg.guild.id].members[msg.author.id].coolDown = (data.guildData[msg.guild.id].members[msg.author.id].coolDown || Date.now()) + findCmd.cooldown
                    }

                    await findCmd.execute.call(poopy, msg, ['setprefix', config.globalPrefix]).catch(async err => {
                        await msg.reply({
                            content: err.stack,
                            allowedMentions: fetchPingPerms(msg)
                        }).catch(() => { })
                        msg.channel.sendTyping().catch(() => { })
                    })
                } else if (words.includes('lore')) {
                    await msg.reply({
                        content: `Well... If you played a little bit with \`${config.globalPrefix}poop\`, I could give you some...`,
                        allowedMentions: fetchPingPerms(msg)
                    }).catch(() => { })
                } else if ((words.includes('how') && words.includes('are') && words.includes('you')) || (words.includes('what') && words.includes('up')) || (words.includes('what') && words.includes('doing')) || words.includes('wassup') || (words.includes('how') && words.includes('it') && words.includes('going'))) {
                    var activity = bot.user.presence.activities[0]
                    if (activity) {
                        await msg.reply({
                            content: `Ya know, just ${DiscordTypes.ActivityType[activity.type].toLowerCase()} ${((activity.type === DiscordTypes.ActivityType.Competing && 'in ') || (activity.type === DiscordTypes.ActivityType.Listening && 'to ') || '')}${activity.name.replace(new RegExp(`${regexClean(` | ${config.globalPrefix}help`)}$`), '')}.`,
                            allowedMentions: fetchPingPerms(msg)
                        }).catch(() => { })
                    }
                } else if (
                    words.some(w => w.match(/.*\?$/)) ||
                    words.includes('is') ||
                    words.includes('do') ||
                    words.includes('did') ||
                    words.includes('are') ||
                    words.includes('will') ||
                    words.includes('were') ||
                    words.includes('can') ||
                    words.includes('if') ||
                    words.includes('when') ||
                    words.includes('where') ||
                    words.includes('how') ||
                    words.includes('why') ||
                    words.includes('what') ||
                    words.includes('who')
                ) {
                    await msg.reply(randomChoice(arrays.eightball)).catch(() => { })
                } else if (words.includes('thank') || words.includes('thanks') || words.includes('thx')) {
                    await msg.reply('You\'re welcome!').catch(() => { })
                } else if (words.some(w => w.match(/^(bitch|.+fucker|loser|.+ass|dipshit|retard|moron|buffoon|idiot|stupid.+|gay.+|dumb.+|kys|clanker|die|rot|nig.+|fag.+)$/))) {
                    await msg.reply('Shut up.').catch(() => { })
                } else if (words.some(w => w.match(/^(hi+|yo+|hello+|howdy|hey(a+)?)$/))) {
                    await msg.reply('Yo! What\'s up?').catch(() => { })
                } else if (
                    words.includes('no') ||
                    words.includes('nope') ||
                    words.includes('nah')
                ) {
                    await msg.reply(':(').catch(() => { })
                } else if (
                    words.includes('ye') ||
                    words.includes('yes') ||
                    words.includes('yea') ||
                    words.includes('yeah') ||
                    words.includes('yep') ||
                    words.includes('ya') ||
                    words.includes('yup')
                ) {
                    await msg.reply(':)').catch(() => { })
                } else {
                    var eggPhrase = ourEggPhrases[tempdata[msg.author.id].mentions]
                    if (eggPhrase) await msg.reply({
                        content: eggPhrase,
                        allowedMentions: fetchPingPerms(msg)
                    }).catch(() => { })
                }
            }
        }]

        callbacks.messageEditCallbacks = [async (oldMsg, msg) => {
            var messages = data.guildData[msg.guild?.id]?.messages
            var tmpMessages = tempdata[msg.guild?.id]?.messages

            var prefix = data.guildData[msg.guild?.id]?.prefix ?? config.globalPrefix

            if (messages && tmpMessages) {
                var messageIndex = messages.findIndex(m => m.id == msg.id)
                if (messageIndex > -1) {
                    var findMessage = messages[messageIndex]
                    var findTmpMessage = tmpMessages[messageIndex]

                    var oldCleanMessage = cleanKeywords(oldMsg.content, oldMsg) // cleanContentPreserveEmojis(oldMsg.content, oldMsg.channel).replace(/\@/g, '@‌')
                    var cleanMessage = cleanKeywords(msg.content, msg) // cleanContentPreserveEmojis(msg.content, msg.channel).replace(/\@/g, '@‌')

                    await updateGenAiModel(oldMsg, {
                        sample: oldCleanMessage,
                        remove: true
                    })

                    if (
                        !(tmpMessages.find(message => message.content.toLowerCase() === cleanMessage.toLowerCase()))
                    ) {
                        findMessage.content = CryptoJS.AES.encrypt(cleanMessage, process.env.AUTH_TOKEN).toString()
                        findTmpMessage.content = cleanMessage

                        updateGenAiModel(msg, {
                            sample: cleanMessage
                        })
                    } else {
                        messages.splice(messageIndex, 1)
                        tmpMessages.splice(messageIndex, 1)
                    }
                }
            }
        }]

        callbacks.messageDeleteCallbacks = [async (msg) => {
            var messages = data.guildData[msg.guild?.id]?.messages
            var tmpMessages = tempdata[msg.guild?.id]?.messages

            if (messages && tmpMessages) {
                var messageIndex = messages.findIndex(m => m.id == msg.id)
                if (messageIndex > -1) {
                    var cleanMessage = cleanKeywords(msg.content, msg) // cleanContentPreserveEmojis(msg.content, msg.channel).replace(/\@/g, '@‌')

                    await updateGenAiModel(msg, {
                        sample: cleanMessage,
                        remove: true
                    })

                    messages.splice(messageIndex, 1)
                    tmpMessages.splice(messageIndex, 1)
                }
            }

            const starboards = data.botData.starboards.filter(
                s => s.guildId == msg?.guild?.id && s.messages[msg.id] != null && !s.keep
            )

            for (let starboard of starboards) {
                const starboardChannel = msg.guild.channels.cache.get(starboard.channelId)
                    ?? await msg.guild.channels.fetch(starboard.channelId).catch(() => { })
                const starboardMsgId = starboard.messages[msg.id]

                if (!starboardChannel) continue

                const starboardMsg = starboardChannel.messages.cache.get(starboardMsgId)
                    ?? await starboardChannel.messages.fetch(starboardMsgId).catch(() => { })
                if (!starboardMsg) continue

                starboardMsg.delete().catch(() => { })
            }
        }]

        callbacks.guildCallbacks = [async guild => {
            infoPost(`Joined a new server (${bot.guilds.cache.size} in total)`)

            var channel = guild.systemChannel || guild.channels.cache.find(c => c.type === Discord.ChannelType.GuildText && (c.name == 'general' || c.name == 'main' || c.name == 'chat'))

            if (!channel) {
                guild.channels.cache.every(c => {
                    if (c.type === Discord.ChannelType.GuildText || c.type === Discord.ChannelType.GuildNews) {
                        if (c.permissionsFor(c.guild.roles.everyone).has(DiscordTypes.PermissionFlagsBits.SendMessages)) {
                            channel = c
                            return false
                        }
                    }
                })
            }

            if (channel) {
                var audit = await guild.fetchAuditLogs().catch(() => { })
                var kickEntry
                var kickType = 'kicking'

                if (audit) {
                    if (audit.entries.size) {
                        kickEntry = audit.entries.find(entry => entry.targetId == bot.user.id && (
                            entry.action == Discord.AuditLogEvent.MemberKick ||
                            entry.action == Discord.AuditLogEvent.MemberPrune ||
                            entry.action == Discord.AuditLogEvent.MemberBanAdd ||
                            entry.action == Discord.AuditLogEvent.MemberBanRemove
                        ))

                        if (
                            kickEntry?.action == Discord.AuditLogEvent.MemberBanAdd ||
                            kickEntry?.action == Discord.AuditLogEvent.MemberBanRemove
                        ) kickType = 'banning'
                    }
                }

                var joinPhrases = [
                    'I arrived.',
                    'I arrived.',
                    'I arrived.',
                    `stop ${kickType} me${kickEntry ? ` ${kickEntry.executor.displayName.toLowerCase()}` : ''}`
                ]

                if (!data.guildData) {
                    data.guildData = {}
                }

                if (!data.guildData[guild.id]) {
                    data.guildData[guild.id] = {}
                }

                if (!data.guildData[guild.id].lastuse) {
                    data.guildData[guild.id].lastuse = Date.now()
                }

                if (!data.guildData[guild.id].joins) {
                    data.guildData[guild.id].joins = 0
                }

                channel.send({
                    content: joinPhrases[data.guildData[guild.id].joins % joinPhrases.length],
                    allowedMentions: {
                        parse: []
                    }
                }).catch(() => { })

                data.guildData[guild.id].joins++
            }
        }]

        callbacks.guildDeleteCallbacks = [async () => {
            infoPost(`Left a server (${bot.guilds.cache.size} in total)`)
        }]

        callbacks.reactionCallbacks = [async (reaction, user) => {
            const msg = await reaction.message.fetch(false).catch(() => { }) ?? reaction.message
            const emoji = reaction.emoji.toString()

            if (user) tempdata.collectors.filter(
                c => c?.id && c?.id == msg.id && c?.type == "reaction"
            ).forEach(collector => collector.collect(reaction, user))

            reaction = msg.reactions.cache.find(r => r.emoji.toString() == emoji) ?? reaction

            const starboards = data.botData.starboards.filter(
                s => s.guildId == msg?.guild?.id && (s.emoji == emoji || s.emoji == "ANY")
            )

            if (starboards.length <= 0) return

            for (const starboard of starboards) {
                const origMsg = msg.messageSnapshots?.size ? msg.messageSnapshots.first() : msg

                const starboardMessageExists = (id, type) => data.botData.starboards.some(
                    sb => sb.channelId == starboard.channelId && Object[type](sb.messages).includes(id)
                )

                if (
                    starboardMessageExists(origMsg.id, "values") ||
                    starboardMessageExists(msg.id, "values")
                ) continue

                const guildId = starboard.guildId
                const channelId = starboard.channelId

                const guild = bot.guilds.cache.get(guildId)
                    ?? await bot.guilds.fetch(guildId).catch(() => { })

                const channel = guild?.channels ? (
                    guild.channels.cache.get(channelId)
                    ?? await guild.channels.fetch(channelId).catch(() => { })
                ) : (
                    bot.channels.cache.get(channelId)
                    ?? await bot.channels.fetch(channelId).catch(() => { })
                    ?? bot.users.cache.get(channelId)
                    ?? await bot.users.fetch(channelId).catch(() => { })
                )

                if (!channel) continue

                tempdata[starboard.guildId] ??= {}
                tempdata[starboard.guildId][starboard.channelId] ??= {}
                tempdata[starboard.guildId][starboard.channelId].starboardMessages ??= {}

                const starboardCache = tempdata[starboard.guildId][starboard.channelId].starboardMessages

                const meetsThreshold = reaction.count >= starboard.threshold
                const cachedStarboardMessage = starboardCache[origMsg.id] ?? starboardCache[msg.id]

                if (!meetsThreshold && !cachedStarboardMessage) continue

                let msgContent = origMsg.content

                if (msg.messageSnapshots?.size) msgContent = `> -# Forwarded\n${origMsg.content ?? ""}`
                else if (msg.reference && !msg.messageSnapshots?.size) {
                    const referenceMsg = await msg.fetchReference().catch(() => { })
                    if (referenceMsg) {
                        const replyMention = msg.mentions.members.find(member => member.user.id === referenceMsg.author.id) ? ` (${referenceMsg.author.toString()})` : ""
                        msgContent = `> -# Reply to: ${referenceMsg.url}${replyMention}\n${origMsg.content ?? ""}`
                    }
                }

                const emojiContent = msg.reactions.cache.filter(
                    r => data.botData.starboards.some(
                        sb => sb.channelId == starboard.channelId && (sb.emoji == r.emoji.toString() || sb.emoji == "ANY") && r.count >= sb.threshold
                    )
                ).map(r => `${r.emoji.toString()} ${r.count}`).join("  ·  ")

                const embedContent = `${emojiContent ? `## ${emojiContent}` : ""}\n\n${msgContent}`.trim()

                const isAttachmentEmbed = (e) =>
                    !(/^(rich|link)$/.test(e.data.type)) &&
                    (!e.data.title || e.data.title.trim() == ".") &&
                    !e.data.description

                const starboardEmbed = new Discord.EmbedBuilder()
                    .setAuthor({
                        name: `${(msg.member ?? msg.author).displayName} (${msg.author.username})`,
                        iconURL: (msg.member ?? msg.author).displayAvatarURL({ dynamic: true, size: 1024, extension: "png" })
                    })
                    .setDescription(embedContent || "None.")
                    .setColor(0xF5C542)

                const origMember = tempdata[starboard.guildId]?.webhookMembers?.[msg.id]
                if (origMember) {
                    starboardEmbed.setFooter({
                        text: `Original Author: ${origMember.displayName} (${origMember.user.username})`,
                        iconURL: origMember.displayAvatarURL({ dynamic: true, size: 1024, extension: "png" })
                    })
                }

                const starboardMsgEmbeds = [...origMsg.embeds.filter(e => !isAttachmentEmbed(e)), starboardEmbed]

                if (!cachedStarboardMessage) {
                    if (
                        starboardMessageExists(origMsg.id, "keys") ||
                        starboardMessageExists(msg.id, "keys")
                    ) continue

                    starboardCache[origMsg.id] = true
                    starboardCache[msg.id] = true

                    const attachments = [
                        ...origMsg.attachments.map(a => new Discord.AttachmentBuilder(a.url)),
                        ...origMsg.stickers.map(s => new Discord.AttachmentBuilder(s.url)),
                        ...origMsg.embeds
                            .filter(e => isAttachmentEmbed(e))
                            .map(e => {
                                const embed = e.toJSON()
                                const data = embed.video ?? embed.thumbnail
                                const ext = data.content_type && data.content_type.split("/")[1]

                                return new Discord.AttachmentBuilder(
                                    data.url, ext ? { name: `file.${embed.video ? "mp4" : ext ?? "png"}` } : undefined
                                )
                            })
                    ]

                    attachments.splice(10)

                    const urls = await refreshDiscordURLs(attachments.map(a => a.attachment)).catch(() => { })
                        ?? attachments.map(a => a.attachment)

                    for (let [i, url] of urls.entries()) {
                        attachments[i].attachment = url
                    }

                    const row = new Discord.ActionRowBuilder().addComponents(
                        new Discord.ButtonBuilder()
                            .setStyle(Discord.ButtonStyle.Link)
                            .setURL(`https://discord.com/channels/${msg.guild.id}/${msg.channel.id}/${msg.id}`)
                            .setLabel('Jump to message')
                    )

                    const starboardMsg = await channel.send({
                        embeds: starboardMsgEmbeds,
                        components: [row],
                        files: attachments,
                        allowedMentions: { parse: [] }
                    }).catch((err) => { console.log(err) })

                    starboardCache[origMsg.id] = starboardMsg
                    starboardCache[msg.id] = starboardMsg

                    if (starboardMsg) {
                        starboard.messages[origMsg.id] = starboardMsg.id
                        starboard.messages[msg.id] = starboardMsg.id
                    } else {
                        console.log('toilet')
                        console.log(channel)
                    }
                }

                if (cachedStarboardMessage && cachedStarboardMessage !== true) {
                    await cachedStarboardMessage.edit({
                        embeds: starboardMsgEmbeds
                    }).catch(() => { })
                }
            }
        }]

        callbacks.interactionCallbacks = [async (interaction) => {
            dmSupport(interaction)

            var interactionFunctions = [
                {
                    type: interaction.type === DiscordTypes.InteractionType.ApplicationCommandAutocomplete,
                    execute: async () => {
                        var cmd = interaction.commandName
                        var subcommand = interaction.options.getSubcommand(false)
                        var findCmd = findCommand(cmd)
                        var findSubCmd = subcommand && findCommand(subcommand)
                        var commandGroup = findGroup(cmd)
                        var commandSubGroup = subcommand && findGroup(subcommand)

                        if (!commandGroup && findCmd?.subcommands?.find(subcmd => subcmd.name == subcommand)) {
                            // commands with subcommands
                            cmd += ` ${subcommand}`
                            findCmd = findCmd.subcommands.find(subcmd => subcmd.name == subcommand)
                        } else if (commandSubGroup) {
                            // commands in groups
                            cmd = subcommand
                            findCmd = findSubCmd
                        } else if (!findCmd) {
                            // command doesn't exist
                            await interaction.respond([]).catch(() => { })
                            return
                        } // regular command

                        var focused = interaction.options.getFocused(true)
                        var findArg = findCmd.args.find(arg => arg.name.toLowerCase() == focused.name)
                        var autocompleteValues = typeof findArg.autocomplete == 'function' ?
                            await findArg.autocomplete.call(poopy, interaction) :
                            findArg.autocomplete

                        var choices = autocompleteValues
                            .sort((a, b) =>
                                Math.abs(
                                    1 - similarity(String(a.name ?? a ?? '(blank)'), focused.value)
                                ) - Math.abs(
                                    1 - similarity(String(b.name ?? b ?? '(blank)'), focused.value)
                                )
                            ).sort((a, b) => {
                                var x = String(a.name ?? a ?? '(blank)').toLowerCase().includes(focused.value.toLowerCase())
                                var y = String(b.name ?? b ?? '(blank)').toLowerCase().includes(focused.value.toLowerCase())

                                return (x === y) ? 0 : x ? -1 : 1
                            }).slice(0, 25)

                        await interaction.respond(
                            choices.map(choice => ({ name: String(choice.name ?? choice ?? '(blank)').replace(/\n|\r/g, ' ').substring(0, 100) || '(blank)', value: choice.value ?? choice }))
                        )
                    }
                },

                {
                    type: interaction.type === DiscordTypes.InteractionType.MessageComponent,
                    execute: async () => {
                        tempdata.collectors.filter(
                            c => c?.id && c?.id == interaction.message.id && c?.type == "component"
                        ).forEach(collector => collector.collect(interaction))
                    }
                },

                {
                    type: interaction.type === DiscordTypes.InteractionType.ApplicationCommand,
                    execute: async () => {
                        var cmd = interaction.commandName
                        var subcommand = interaction.options.getSubcommand(false)
                        var findCmd = findCommand(cmd == "undefined" ? "" : cmd)
                        var findSubCmd = subcommand && findCommand(subcommand)
                        var commandGroup = findGroup(cmd)
                        var commandSubGroup = subcommand && findGroup(subcommand)

                        if (!commandGroup && findCmd?.subcommands?.find(subcmd => subcmd.name == subcommand)) {
                            // commands with subcommands
                            cmd += ` ${subcommand}`
                            findCmd = findCmd.subcommands.find(subcmd => subcmd.name == subcommand)
                        } else if (commandSubGroup) {
                            // commands in groups
                            cmd = subcommand
                            findCmd = findSubCmd
                        } else if (!findCmd) {
                            // command doesn't exist
                            await interaction.reply('No.').catch(() => { })
                            return
                        } // regular command

                        var cmdArgs = findCmd.args

                        var prefix = data.guildData[interaction.guild?.id]?.prefix ?? config.globalPrefix
                        var argContent = []

                        var extraContent = interaction.options.getString('extrapayload') ?? ''

                        for (var cmdArg of cmdArgs) {
                            var value = interaction.options.getString(cmdArg.name.toLowerCase())
                            if (value != null) {
                                if (cmdArg.orig.match(/^"([\s\S]*?)"$/)) {
                                    vars.symbolreplacements.forEach(symbolReplacement => {
                                        symbolReplacement.target.forEach(target => {
                                            value = value.replace(new RegExp(target, 'ig'), symbolReplacement.replacement)
                                        })
                                    })
                                    value = `"${value.replace(/"/g, "''")}"`
                                }

                                argContent.push((`${cmdArg.specifarg ? `-${cmdArg.name}` : ''} ${!(cmdArg.specifarg && cmdArg.orig == `[-${cmdArg.name}]`) ? value : ''}`).trim())
                            }
                        }

                        argContent = argContent.join(' ')

                        var content = [cmd]

                        if (argContent) content.push(argContent)
                        if (extraContent) content.push(extraContent)

                        content = `${prefix}${content.join(' ')}`

                        var attachments = {}

                        for (var i = 1; i <= 2; i++) {
                            var attachment = interaction.options.getAttachment(`extraattachment${i}`)
                            if (attachment) {
                                attachments[attachment.id] = attachment
                            }
                        }

                        var hasPerms = (
                            interaction.member.permissions.has(DiscordTypes.PermissionFlagsBits.ManageGuild) ||
                            interaction.member.permissions.has(DiscordTypes.PermissionFlagsBits.Administrator) ||
                            interaction.user.id === interaction.guild.ownerId ||
                            (config.ownerids.find(id => id == interaction.user.id))
                        )

                        var hasMessagePerms = hasPerms || interaction.member.permissions.has(DiscordTypes.PermissionFlagsBits.ManageMessages)

                        var guildfilter = config.guildfilter
                        var channelfilter = config.channelfilter

                        var isFiltered = (guildfilter.blacklist && guildfilter.ids.includes(interaction.guild?.id)) ||
                            (
                                !(guildfilter.blacklist) &&
                                !(guildfilter.ids.includes(interaction.guild?.id))
                            ) ||
                            (
                                channelfilter.gids.includes(interaction.guild?.id) &&
                                (
                                    (channelfilter.blacklist && channelfilter.ids.some(
                                        id => id == interaction.channel?.id || id == interaction.channel?.parent?.id || id == interaction.channel?.parent?.parent?.id
                                    )) ||
                                    (!(channelfilter.blacklist) && !(channelfilter.ids.some(
                                        id => id == interaction.channel?.id || id == interaction.channel?.parent?.id || id == interaction.channel?.parent?.parent?.id
                                    )))
                                )
                            )

                        var isRestricted = data.guildData[interaction.guild.id]?.restricted?.some(
                            id => id == interaction.channel?.id || id == interaction.channel?.parent?.id || id == interaction.channel?.parent?.parent?.id
                        ) && !hasMessagePerms

                        if (isRestricted || isFiltered || tempdata[interaction.guild.id]?.[interaction.channel.id]?.shutUp) {
                            await interaction.reply({
                                content: "Nope!",
                                flags: DiscordTypes.MessageFlags.Ephemeral
                            }).catch(() => { })
                            return
                        }

                        if (interaction.guild?.autoModerationRules && interaction.member && !hasPerms) {
                            let automodRules = tempdata[interaction.guild.id].automodRules
                            if (!automodRules)
                                automodRules = tempdata[interaction.guild.id].automodRules
                                    = await interaction.guild.autoModerationRules.fetch().then(r => [...r.values()]).catch(() => { }) ?? []

                            const brokenRules = []

                            let timeoutDuration = 0
                            let blockMessage

                            for (const automodRule of automodRules) {
                                const isDisabled = !automodRule.enabled ||
                                    automodRule.exemptRoles.some(role => interaction.member.roles.cache.has(role.id)) ||
                                    automodRule.exemptChannels.has(interaction.channel.id)
                                if (isDisabled) continue

                                const triggerMetadata = automodRule.triggerMetadata
                                const actions = automodRule.actions

                                if (automodRule.triggerType == DiscordTypes.AutoModerationRuleTriggerType.Keyword) {
                                    const [broken] = autoModContent(content, triggerMetadata)

                                    if (broken) {
                                        brokenRules.push(automodRule.name)

                                        for (const action of actions) {
                                            if (action.type == DiscordTypes.AutoModerationActionType.BlockMessage)
                                                blockMessage = blockMessage || (action.metadata.customMessage ?? "")

                                            if (action.type == DiscordTypes.AutoModerationActionType.Timeout)
                                                timeoutDuration = Math.max(action.metadata.durationSeconds * 1000, timeoutDuration)
                                        }
                                    }
                                }
                            }

                            const blockReason = `AutoMod Rule${brokenRules.length > 1 ? "s" : ""}: ${brokenRules.join(", ") || "what"}`

                            if (timeoutDuration > 0) interaction.member.timeout(timeoutDuration, blockReason).catch(() => { })

                            if (blockMessage != undefined) {
                                await interaction.reply({
                                    content: "This content is blocked by this server."
                                        + (blockMessage ? ` From server moderators:\n"${blockMessage}"` : ""),
                                    flags: DiscordTypes.MessageFlags.Ephemeral
                                }).catch(() => { })
                                return
                            }
                        }

                        var hasEphemeralSayPerm = !interaction.isUserApp && hasMessagePerms

                        var hasNoDeleteArg = findCmd.args.some(a => a.name == "nodelete")

                        var isEphemeral = findCmd.ephemeral ? (
                            hasNoDeleteArg ?
                                findCmd.ephemeral && hasEphemeralSayPerm && !interaction.options.getString("nodelete") :
                                findCmd.ephemeral
                        ) : false

                        await interaction.deferReply(isEphemeral ? {
                            flags: DiscordTypes.MessageFlags.Ephemeral
                        } : undefined).catch(() => { })

                        msgSupport(interaction, { content, attachments })

                        await Promise.all(
                            callbacks.messageCallbacks.map(
                                callback => callback(interaction).catch(() => { })
                            )
                        ).catch(() => { })
                        
                        await sleep(1000)
                        if (!interaction.replied) interaction.deleteReply().catch(() => { })
                        else await callbacks.messageCallback(interaction.replied).catch(() => { })
                    }
                }
            ]

            var interactionFunction = interactionFunctions.find(interaction => interaction.type)
            if (interactionFunction) await interactionFunction.execute().catch(() => { })
        }]
    }

    async start(TOKEN) {
        let poopy = this
        let vars = poopy.vars
        let arrays = poopy.arrays
        let bot = poopy.bot
        let rest = poopy.rest
        let config = poopy.config
        let data = poopy.data
        let tempdata = poopy.tempdata
        let globaldata = poopy.globaldata
        let activeBots = poopy.activeBots
        let { fs, axios } = poopy.modules
        let {
            infoPost, toOrdinal, requestData, saveData,
            saveQueue, changeStatus, updateHivemindStatus,
            updateSlashCommands, createCronJob, reconcileDataWithTemplate
        } = poopy.functions
        let callbacks = poopy.callbacks

        if (!TOKEN && !poopy.__TOKEN) {
            throw new Error(`Token can't be blank`)
        }

        if (!poopy.__TOKEN) Object.defineProperty(poopy, '__TOKEN', {
            value: TOKEN,
            writable: false
        })

        if (rest) rest.setToken(poopy.__TOKEN)
        await bot.login(poopy.__TOKEN).catch((e) => console.log(e))

        activeBots[config.database] = poopy

        console.log(`${bot.user.displayName} is online, RUN`)
        infoPost(`${bot.user.displayName} woke up to ash and dust`)
        config.ownerids.push(bot.user.id)

        var poopyDirectories = ['temp', 'tempfiles']

        poopyDirectories.forEach(poopyDirectory => {
            if (!fs.existsSync(poopyDirectory)) {
                fs.mkdirSync(poopyDirectory)
            }
            if (!fs.existsSync(`${poopyDirectory}/${config.database}`)) {
                fs.mkdirSync(`${poopyDirectory}/${config.database}`)
            }
            fs.readdirSync(`${poopyDirectory}/${config.database}`).forEach(folder => {
                fs.rm(`${poopyDirectory}/${config.database}/${folder}`, { force: true, recursive: true })
            })
        })

        console.log(`${bot.user.displayName}: initialize data gathering`)
        infoPost(`Gathering data in \`${config.database}\``)

        if (process.env.CLOUDAMQP_URL) vars.amqpconn = await require('amqplib').connect(process.env.CLOUDAMQP_URL)
        var gdata = await requestData()

        if (gdata) {
            for (var type in gdata.data) data[type] = gdata.data[type]
            if (Object.keys(globaldata).length <= 0 && gdata.globaldata) for (var type in gdata.globaldata) globaldata[type] = gdata.globaldata[type]
        }

        data.botData ??= {}
        data.guildData ??= {}
        data.userData ??= {}

        reconcileDataWithTemplate(data.botData, vars.dataTemplate.botData)

        if (data.botData.reboots != undefined) data.botData.reboots++

        reconcileDataWithTemplate(globaldata, vars.globaldataTemplate)
        globaldata.shit = globaldata.shit.filter(id => !config.ownerids.includes(id))

        reconcileDataWithTemplate(tempdata, vars.tempdataTemplate, null, ["guildId", "userId"])

        console.log(`${bot.user.displayName}: main data gathered!!!`)
        infoPost(`Main data gathered, gathering extra data...`)

        let dataGetters = require('./src/dataGetters')

        console.log(`${bot.user.displayName}: gather some arrays`)

        var arrayList = await dataGetters.arrays().catch(() => { }) ?? {}
        for (var arrayKey in arrayList) {
            var globalDataKey = vars.fileJsons[arrayKey]
            var array = arrayList[arrayKey]

            if (!globaldata[globalDataKey]?.length) globaldata[globalDataKey] = array

            arrays[arrayKey] = globaldata[globalDataKey]
        }

        vars.filecount = data.botData.filecount || 0

        console.log(`${bot.user.displayName}: gathering extra values`)
        vars.languages = await dataGetters.languages().catch(() => { }) ?? []
        vars.codelanguages = await dataGetters.codeLanguages().catch(() => { }) ?? []

        console.log(`${bot.user.displayName}: gathering some jsons`)
        poopy.json = await dataGetters.jsons().catch(() => { }) ?? {}

        console.log(`${bot.user.displayName}: all done, it's actually online now`)
        infoPost(`Reboot ${data.botData.reboots} succeeded, it's up now`)

        var currentIpAddress = await axios.get('https://api.ipify.org').then(res => (res.data ?? "").trim()).catch(() => { })
        if (currentIpAddress) Object.defineProperty(vars, 'currentIpAddress', {
            value: currentIpAddress,
            writable: false
        })

        for (let starboard of data.botData.starboards) {
            tempdata[starboard.guildId] ??= {}
            tempdata[starboard.guildId][starboard.channelId] ??= {}
            tempdata[starboard.guildId][starboard.channelId].starboardMessages ??= {}
        }

        for (let script of globaldata.initScripts) {
            if (script.match(vars.validUrl))
                script = await axios.get(script).then((res) => res.data.toString()).catch(() => script)

            try {
                eval(script)
            } catch (e) {
                console.log(e)
            }
        }

        saveData()
        saveQueue()

        updateSlashCommands()

        changeStatus()
        vars.statusInterval = setInterval(function () {
            changeStatus()
        }, 300000)

        var wakecount = data.botData.reboots + 1
        var wakeChannel = bot.guilds.cache.get('834431435704107018')?.channels.cache.get('947167169718923341')

        if (wakeChannel) {
            wakeChannel.send(!config.stfu ? 'i wake up to ash and dust' : '').catch(() => { })
            wakeChannel.send(!config.stfu ? (
                config.dataLoadError ?
                    'ERROR LOADING EXISTING DATA. temporarily using new data as fallback...' :
                    config.testing ?
                        'raleigh is testing' :
                        `this is the ${toOrdinal(wakecount)} time this happens`) : ''
            ).catch(() => { })
        }

        updateHivemindStatus()
        if (process.env.HIVEMIND_ID) {
            vars.hivemindStatusInterval = setInterval(function () {
                updateHivemindStatus()
            }, 60000)
        }

        if (!config.apiMode) {
            bot.on('messageCreate', (msg) => callbacks.messageCallbacks.forEach(callback => callback(msg).catch((e) => console.log(e))))
            
            bot.on('messageUpdate', (oldMsg, msg) => callbacks.messageEditCallbacks.forEach(callback => callback(oldMsg, msg).catch((e) => console.log(e))))
            bot.on('messageDelete', (msg) => callbacks.messageDeleteCallbacks.forEach(callback => callback(msg).catch((e) => console.log(e))))
            bot.on('messageDeleteBulk', (messages) => messages.forEach((msg) => callbacks.messageDeleteCallbacks.forEach(callback => callback(msg).catch((e) => console.log(e)))))
            
            bot.on('guildCreate', (guild) => callbacks.guildCallbacks.forEach(callback => callback(guild).catch((e) => console.log(e))))
            bot.on('guildDelete', (guild) => callbacks.guildDeleteCallbacks.forEach(callback => callback(guild).catch((e) => console.log(e))))
            
            bot.on('messageReactionAdd', (reaction, user) => callbacks.reactionCallbacks.forEach(callback => callback(reaction, user).catch((e) => console.log(e))))
            bot.on('messageReactionRemove', (reaction, user) => callbacks.reactionCallbacks.forEach(callback => callback(reaction, user).catch((e) => console.log(e))))
            bot.on('messageReactionRemoveAll', (_, reactions) => reactions.forEach((reaction) => callbacks.reactionCallbacks.forEach(callback => callback(reaction).catch((e) => console.log(e)))))
            bot.on('messageReactionRemoveEmoji', (reaction) => callbacks.reactionCallbacks.forEach(callback => callback(reaction).catch((e) => console.log(e))))
            
            bot.on('interactionCreate', (interaction) => callbacks.interactionCallbacks.forEach(callback => callback(interaction).catch((e) => console.log(e))))

            bot.on('error', (err) => console.log(err))
        }

        for (let cronData of data.botData.crons) createCronJob(cronData).catch(() => { })

        vars.started = true
    }

    async destroy(deldata) {
        let poopy = this
        let vars = poopy.vars
        let bot = poopy.bot
        let config = poopy.config
        let globaldata = poopy.globaldata
        let activeBots = poopy.activeBots
        let { saveData } = poopy.functions

        clearInterval(vars.statusInterval)
        clearInterval(vars.saveInterval)
        if (vars.hivemindStatusInterval !== undefined) {
            clearInterval(vars.hivemindStatusInterval)
        }

        vars.started = false
        delete activeBots[config.database]
        bot.destroy()

        await saveData()

        if (deldata) {
            delete poopy.data
            delete poopy.tempdata

            if (config.quitOnDestroy)
                for (var type in globaldata)
                    delete globaldata[type]
        }
    }
}

module.exports = Poopy
