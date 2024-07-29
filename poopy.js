/** A pooper. */
class Poopy {
    constructor(cfg = {}) {
        // setting up options

        let poopy = this

        let config = poopy.config = {
            testing: false,
            poosonia: false,
            hivemind: false,
            forcetrue: false,
            useReactions: false,
            textEmbeds: false,
            notSave: false,
            apiMode: false,
            noInfoPost: false,
            triggerPhrase: undefined,
            poosoniablacklist: ['dm', 'tdms', 'spam', 'eval', 'leave'],
            poosoniakeywordblacklist: [],
            poosoniafunctionblacklist: ['msgcollector', 'stopcollector', 'stopallcollectors'],
            allowtesting: true,
            allowpingresponses: true,
            allowbotusage: false,
            database: 'poopydata',
            globalPrefix: 'p:',
            stfu: false,
            intents: 65209,
            ownerids: ['464438783866175489', '454732245425455105', '613501149282172970', '486845950200119307', '714448511508414547', '395947826690916362', '340847078236225537'],
            jsoning: ['411624455194804224', '486845950200119307'],
            illKillYouIfYouUseEval: ['535467581881188354'],
            guildfilter: {
                blacklist: true,
                ids: []
            },
            channelfilter: {
                blacklist: true,
                gids: [],
                ids: []
            },
            msgcooldown: 0,
            pingresponselimit: 0,
            pingresponsecooldown: 60000,
            limits: {
                size: {
                    image: 20,
                    gif: 20,
                    video: 20,
                    audio: 20,
                    message: `That file exceeds the size limit of {param} mb. (try to use the shrink, setfps, trim or crunch commands)`
                },
                frames: {
                    gif: 1000,
                    video: 10000,
                    message: `The frames in that file exceed the limit of {param}. (try to use the setfps or the trim commands)`
                },
                width: {
                    image: 3000,
                    gif: 1000,
                    video: 2000,
                    message: `The width of that file exceeds the limit of {param}. (try to use the shrink command)`
                },
                height: {
                    image: 3000,
                    gif: 1000,
                    video: 2000,
                    message: `The height of that file exceeds the limit of {param}. (try to use the shrink command)`
                }
            },
            limitsexcept: {
                size: {
                    image: 100,
                    gif: 100,
                    video: 100,
                    audio: 100,
                    message: `That file exceeds the exception size limit of {param} mb.`
                },
                frames: {
                    gif: 5000,
                    video: 50000,
                    message: `The frames in that file exceed the exception limit of {param}.`
                },
                width: {
                    image: 10000,
                    gif: 2000,
                    video: 5000,
                    message: `The width of that file exceeds the exception limit of {param}.`
                },
                height: {
                    image: 10000,
                    gif: 2000,
                    video: 5000,
                    message: `The height of that file exceeds the exception limit of {param}.`
                }
            },
            commandLimit: 5,
            defaultDisabled: [['e926', 'furryart']],
            keyLimit: 500,
            rateLimit: 3,
            rateLimitTime: 60000 * 2,
            memLimit: 0,
            quitOnDestroy: false
        }

        for (var i in cfg) {
            config[i] = cfg[i]
        }

        // setting values
        let dataValues = require('./src/dataValues')
        let varsList = require('./src/vars')
        let modulesList = require('./src/modules')
        let functionsList = require('./src/functions')

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

        // we can create thge bot now
        let { Discord, Collection, fs, CryptoJS } = modules
        let { envsExist, configFlagsEnabled,
            chunkArray, chunkObject, requireJSON, findCommand,
            dmSupport, sleep, gatherData, deleteMsgData, infoPost,
            getKeywordsFor, getUrls, randomChoice, similarity, yesno,
            cleverbot, regexClean, decrypt, getOption, getTotalHivemindStatus } = functions

        let bot = poopy.bot = new Discord.Client({
            intents: config.intents,
            partials: [Discord.Partials.Channel],
            failIfNotExists: false,
            presence: {
                status: 'idle',
                activities: [
                    {
                        name: 'gathering data...',
                        type: Discord.ActivityType.Competing,
                        url: 'https://www.youtube.com/watch?v=LDQO0ALm0gE'
                    }
                ]
            }
        })
        if (Discord.REST) poopy.rest = new Discord.REST({
            version: '10'
        })
        poopy.package = JSON.parse(fs.readFileSync('package.json'))

        bot.database = config.database

        class FakeCollector {
            constructor() {
                this.on = () => { }
                this.once = () => { }
                this.resetTimer = () => { }
                this.stop = () => { }
            }
        }

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

        if (config.testing) fs.readdirSync('src/soon').forEach(name => {
            var cmd = name.replace(/\.js$/, '')
            var cmdData = require(`./src/soon/${name}`)
            if (!(config.poosonia && config.poosoniablacklist.find(cmdname => cmdname == cmd)) && envsExist(cmdData.envRequired ?? []) && configFlagsEnabled(cmdData.configRequired ?? []) && !(cmdData.configBlacklist && configFlagsEnabled(cmdData.configBlacklist))) {
                commands.push(cmdData)
            }
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
        }

        commands.forEach(cmdData => {
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
        vars.devCmds = []
        vars.sections = []
        vars.types = ['Local']

        for (var i in commands) {
            var command = commands[i]

            if (command.type === "Owner") {
                vars.devCmds.push(command.help)
            } else if (command.type === "JSON Club") {
                vars.jsonCmds.push(command.help)
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

        vars.categories = {
            "Angry Luigi": 'Commands exclusive to Angry Luigi.',
            Animation: 'Move and animate a file in an indefinite amount of ways.',
            Audio: 'Add an effect to an input\'s audio.',
            Battling: 'Beat people up. Yeah.',
            Captions: 'Add a caption to an input.',
            Color: 'Change an input\'s colors.',
            Compression: 'Useful commands for file compression.',
            Conversion: 'Convert a file between various different formats.',
            Currency: 'Manage your money and spend it on upgrades and cosmetics.',
            Duration: 'Change the duration of a video, GIF or audio.',
            Effects: 'A wide range of commands that change the way the file looks.',
            Fetching: 'Image, GIF, and video fetching commands.',
            Generation: 'Generate things from an AI or not.',
            'Hex Manipulation': 'Manipulate the file\'s Hex Code to make it shorter, longer, etc.',
            'Inside Joke': 'phexonia studios',
            'JSON Club': 'Exclusive to some people for editing the JSONs used by Poopy.',
            Main: 'Poopy\'s main commands.',
            Memes: 'Integrate an input in many different meme formats.',
            Mirroring: 'Flip or mirror a file in different axes.',
            Owner: 'salami commands',
            Overlaying: 'For stacking or overlaying a file on top of another.',
            Random: 'Send a random value from a collection of values.',
            Resizing: 'Scale a file in some way.',
            Settings: 'Manage a server\'s Poopy settings, or your own Poopy settings.',
            Text: 'Commands that serve text as output.',
            Unique: 'Commands that resemble unique features to Poopy, keywords for example.',
            Webhook: 'Webhook commands.'
        }

        callbacks.messageCallback = async msg => {
            var origcontent = msg.content

            dmSupport(msg)

            data.botData['messages']++

            var dataError = false
            await gatherData(msg).catch((err) => dataError = err)
            if (dataError) return console.log(dataError)

            var prefix = data.guildData[msg.guild.id]?.['prefix'] ?? config.globalPrefix
            var hivemind = data.guildData[msg.guild.id]['poopymode'] ? "All" : "One"

            if (msg.channel.type == Discord.ChannelType.DM && msg.type !== Discord.InteractionType.ApplicationCommand && !origcontent.includes(prefix)) {
                if (msg.author.bot || msg.author.id == bot.user.id) return
                await msg.channel.sendTyping().catch(() => { })
                await sleep(Math.floor(Math.random() * 500) + 500)
                await msg.channel.send(arrays.dmPhrases[Math.floor(Math.random() * arrays.dmPhrases.length)]
                    .replace(/{mention}/, msg.author.toString())).catch(() => { })
                return
            }

            if (!config.ownerids.find(id => id == msg.author.id) && config.testing && !config.allowtesting) {
                await msg.reply('you won\'t use me any time soon')
                return
            }

            var guildfilter = config.guildfilter
            var channelfilter = config.channelfilter

            if (
                !msg.guild ||
                !msg.channel ||
                tempdata[msg.guild.id][msg.channel.id]['shut'] ||
                (guildfilter.blacklist && guildfilter.ids.includes(msg.guild.id)) ||
                (!(guildfilter.blacklist) && !(guildfilter.ids.includes(msg.guild.id))) ||
                (channelfilter.gids.includes(msg.guild.id) &&
                    ((channelfilter.blacklist && channelfilter.ids.includes(msg.channel.id)) ||
                        (!(channelfilter.blacklist) && !(channelfilter.ids.includes(msg.channel.id)))))
            ) {
                deleteMsgData(msg)
                return
            }

            var webhook = await msg.fetchWebhook().catch(() => { })

            if (webhook || !msg.guild || !msg.channel) {
                deleteMsgData(msg)
                return
            }

            if (data.guildData[msg.guild.id]['chaos'] && globaldata['shit'].find(id => id === msg.author.id)) {
                await msg.reply('shit').catch(() => { })
                return
            }

            var cmds = data.guildData[msg.guild.id]['chaincommands'] == true ? origcontent.split(/ ?-\|- ?/) : [origcontent]
            var allcontents = []
            var webhooked = false

            async function webhookify() {
                webhooked = true

                if (!(origcontent || msg.attachments.size || msg.embeds.length) ||
                    (
                        msg.channel.type === Discord.ChannelType.PublicThread ||
                        msg.channel.type === Discord.ChannelType.PrivateThread ||
                        msg.channel.type === Discord.ChannelType.AnnouncementThread
                    )) {
                    return
                }

                if (data.guildData[msg.guild.id]['members'][msg.author.id]['custom']) {
                    var attachments = msg.attachments.map(attachment => new Discord.AttachmentBuilder(attachment.url, attachment.name))
                    var embeds = msg.embeds.filter(embed => embed.type === 'rich')
                    var name = data.guildData[msg.guild.id]['members'][msg.author.id]['custom']['name']
                    var randomindex = Math.floor(Math.random() * name.length)
                    name = `${name.substring(0, randomindex)}​${name.substring(randomindex, name.length)}`
                    var sendObject = {
                        username: name.substring(0, 32),
                        avatarURL: data.guildData[msg.guild.id]['members'][msg.author.id]['custom']['avatar'],
                        files: attachments,
                        embeds: embeds,
                        stickers: msg.stickers,
                        allowedMentions: {
                            parse: ((!msg.member.permissions.has('Administrator') && !msg.member.permissions.has('MentionEveryone') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                        }
                    }
                    if (origcontent) {
                        sendObject.content = origcontent
                    }
                    var webhooks = await msg.channel.fetchWebhooks().catch(() => { })
                    if (webhooks ? webhooks.size : undefined) {
                        var findWebhook = webhooks.find(webhook => bot.user === webhook.owner)
                        if (findWebhook) {
                            await findWebhook.send(sendObject).then(() => {
                                msg.delete().catch(() => { })
                            }).catch(() => { })
                        } else {
                            var createdWebhook = await msg.channel.createWebhook({ name: 'Poopyhook', avatar: 'https://cdn.discordapp.com/attachments/760223418968047629/835923489834664056/poopy2.png' }).catch(() => { })
                            if (!createdWebhook) {
                                await msg.reply(`I need the manage webhooks permission to turn you into ${data.guildData[msg.guild.id]['members'][msg.author.id]['custom']['name']}.`).catch(() => { })
                            } else {
                                await createdWebhook.send(sendObject).then(() => {
                                    msg.delete().catch(() => { })
                                }).catch(() => { })
                            }
                        }
                    } else {
                        var createdWebhook = await msg.channel.createWebhook({ name: 'Poopyhook', avatar: 'https://cdn.discordapp.com/attachments/760223418968047629/835923489834664056/poopy2.png' }).catch(() => { })
                        if (!createdWebhook) {
                            await msg.reply(`I need the manage webhooks permission to turn you into ${data.guildData[msg.guild.id]['members'][msg.author.id]['custom']['name']}.`).catch(() => { })
                        } else {
                            await createdWebhook.send(sendObject).then(() => {
                                msg.delete().catch(() => { })
                            }).catch(() => { })
                        }
                    }
                } else if (data.guildData[msg.guild.id]['members'][msg.author.id]['impostor']) {
                    var attachments = msg.attachments.map(attachment => new Discord.AttachmentBuilder(attachment.url, attachment.name))
                    var embeds = msg.embeds.filter(embed => embed.type === 'rich')
                    var sendObject = {
                        username: msg.member.nickname || msg.author.username,
                        avatarURL: 'https://cdn.discordapp.com/attachments/760223418968047629/835923486668750888/imposter.jpg',
                        files: attachments,
                        embeds: embeds,
                        stickers: msg.stickers,
                        allowedMentions: {
                            parse: ((!msg.member.permissions.has('Administrator') && !msg.member.permissions.has('MentionEveryone') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                        }
                    }
                    if (origcontent) {
                        sendObject.content = origcontent
                    }
                    var webhooks = await msg.channel.fetchWebhooks().catch(() => { })
                    if (webhooks ? webhooks.size : undefined) {
                        var findWebhook = webhooks.find(webhook => bot.user === webhook.owner)
                        if (findWebhook) {
                            await findWebhook.send(sendObject).then(() => {
                                msg.delete().catch(() => { })
                            }).catch(() => { })

                        } else {
                            var createdWebhook = await msg.channel.createWebhook({ name: 'Poopyhook', avatar: 'https://cdn.discordapp.com/attachments/760223418968047629/835923489834664056/poopy2.png' }).catch(() => { })
                            if (!createdWebhook) {
                                await msg.reply(`I need the manage webhooks permission to turn you into the impostor.`).catch(() => { })
                            } else {
                                await createdWebhook.send(sendObject).then(() => {
                                    msg.delete().catch(() => { })
                                }).catch(() => { })
                            }
                        }
                    } else {
                        var createdWebhook = await msg.channel.createWebhook({ name: 'Poopyhook', avatar: 'https://cdn.discordapp.com/attachments/760223418968047629/835923489834664056/poopy2.png' }).catch(() => { })
                        if (!createdWebhook) {
                            await msg.reply(`I need the manage webhooks permission to turn you into the impostor.`).catch(() => { })
                        } else {
                            await createdWebhook.send(sendObject).then(() => {
                                msg.delete().catch(() => { })
                            }).catch(() => { })
                        }
                    }
                }
            }

            async function executeCommand() {
                var executed = false

                for (var i in cmds) {
                    var cmd = cmds[i]

                    msg.oldcontent = cmd

                    if (
                        !config.poosonia &&
                        (
                            data.guildData[msg.guild.id]['keyexec'] == 2 ||
                            (data.guildData[msg.guild.id]['keyexec'] == 1 && cmd.toLowerCase().startsWith(prefix.toLowerCase()))
                        ) && !commands.find(
                            c => c.raw &&
                                c.name.find(n => cmd.toLowerCase().startsWith(`${prefix.toLowerCase()}${n.toLowerCase()}`))
                        ) &&
                        ((!msg.author.bot && msg.author.id != bot.user.id) || config.allowbotusage)
                    ) {
                        var change = await getKeywordsFor(cmd, msg, false, { resetattempts: true }).catch(async err => {
                            await msg.reply({
                                content: err.stack,
                                allowedMentions: {
                                    parse: ((!msg.member.permissions.has('Administrator') && !msg.member.permissions.has('MentionEveryone') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                                }
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
                        await webhookify().catch(() => { })
                        msg.content = origcontent = content
                    }

                    await getUrls(msg, {
                        update: true,
                        string: origcontent
                    }).catch(async err => {
                        try {
                            await msg.reply({
                                content: err.stack,
                                allowedMentions: {
                                    parse: ((!msg.member.permissions.has('Administrator') && !msg.member.permissions.has('MentionEveryone') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                                }
                            }).catch(() => { })
                        } catch (_) { }
                    })

                    if (tempdata[msg.guild.id][msg.channel.id]['shut']) break

                    if (origcontent.toLowerCase().startsWith(prefix.toLowerCase()) && ((!msg.author.bot && msg.author.id != bot.user.id) || config.allowbotusage)) {
                        data.guildData[msg.guild.id]['lastuse'] = Date.now()

                        var hivemindPass = true

                        if (process.env.HIVEMIND_ID && config.hivemind && !data.guildData[msg.guild.id]['poopymode']) {
                            await getTotalHivemindStatus().then(totalStatus => {
                                var first = totalStatus[0].id == process.env.HIVEMIND_ID
    
                                if (!first) {
                                    hivemindPass = false
                                }
                            })
                        }

                        if (!msg.channel.permissionsFor(msg.guild.members.me).has('SendMessages', false)) {
                            executed = true
                            if (hivemindPass) {
                                var emojis = msg.guild.emojis.cache.filter(emoji => !config.self ? emoji.available : emoji.available && !emoji.animated).map(emoji => emoji.toString())
                                await msg.react(randomChoice(emojis)).catch(() => { })
                            }
                        }

                        if (tempdata[msg.author.id]['ratelimited']) {
                            executed = true

                            var totalSeconds = (tempdata[msg.author.id]['ratelimited'] - Date.now()) / 1000
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

                        if (globaldata['shit'].find(id => id === msg.author.id)) {
                            executed = true
                            if (hivemindPass) {
                                await msg.reply('shit').catch(() => { })
                            }
                            return
                        }

                        if (data.guildData[msg.guild.id]['members'][msg.author.id]['coolDown']) {
                            if ((data.guildData[msg.guild.id]['members'][msg.author.id]['coolDown'] - Date.now()) > 0 &&
                                tempdata[msg.author.id]['cooler'] !== msg.id) {
                                if (hivemindPass) {
                                    await msg.reply(`Calm down! Wait more ${(data.guildData[msg.guild.id]['members'][msg.author.id]['coolDown'] - Date.now()) / 1000} seconds.`).catch(() => { })
                                }
                                return
                            } else {
                                data.guildData[msg.guild.id]['members'][msg.author.id]['coolDown'] = false
                                delete tempdata[msg.author.id]['cooler']
                            }
                        }

                        tempdata[msg.author.id]['cooler'] = msg.id

                        var args = origcontent.substring(prefix.toLowerCase().length).split(' ')
                        var findCmd = findCommand(args[0].toLowerCase())
                        var findLocalCmd = data.guildData[msg.guild.id]['localcmds'].find(cmd => cmd.name === args[0].toLowerCase())
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

                        for (var i in data.guildData[msg.guild.id]['localcmds']) {
                            var fcmd = data.guildData[msg.guild.id]['localcmds'][i]
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

                            if (data.guildData[msg.guild.id]['disabled'].find(cmd => cmd.find(n => n === args[0].toLowerCase()))) {
                                await msg.reply('This command is disabled in this server.').catch(() => { })
                            } else {
                                var increaseCount = !(findCmd.execute.toString().includes('sendFile') && msg.nosend)

                                if (increaseCount) {
                                    if (tempdata[msg.author.id][msg.id]?.['execCount'] >= 1 && data.guildData[msg.guild.id]['chaincommands'] == false) {
                                        await msg.reply('You can\'t chain commands in this server.').catch(() => { })
                                        return
                                    }

                                    if (tempdata[msg.author.id][msg.id]?.['execCount'] >= config.commandLimit * ((msg.member.permissions.has('ManageGuild') || msg.member.permissions.has('ManageMessages') || msg.member.permissions.has('Administrator') || msg.author.id === msg.guild.ownerID) ? 5 : 1)) {
                                        await msg.reply(`Number of commands to run at the same time must be smaller or equal to **${config.commandLimit * ((msg.member.permissions.has('ManageGuild') || msg.member.permissions.has('ManageMessages') || msg.member.permissions.has('Administrator') || msg.author.id === msg.guild.ownerID) ? 5 : 1)}**!`).catch(() => { })
                                        return
                                    }

                                    if (!data.guildData[msg.guild.id]['chaos']) tempdata[msg.author.id][msg.id]['execCount']++
                                }

                                if (findCmd.cooldown) {
                                    data.guildData[msg.guild.id]['members'][msg.author.id]['coolDown'] = (data.guildData[msg.guild.id]['members'][msg.author.id]['coolDown'] || Date.now()) + findCmd.cooldown / ((msg.member.permissions.has('ManageGuild') || msg.member.permissions.has('ManageMessages') || msg.member.permissions.has('Administrator') || msg.author.id === msg.guild.ownerID) && (findCmd.type === 'Text' || findCmd.type === 'Main') ? 5 : 1)
                                }

                                delete msg.nosend
                                msg.nosend = getOption(args, 'nosend', { n: 0, splice: true, dft: false })

                                vars.cps++
                                data.botData['commands']++
                                var t = setTimeout(() => {
                                    vars.cps--
                                    clearTimeout(t)
                                }, 60000)
                                infoPost(`Command \`${args[0].toLowerCase()}\` used`)
                                await findCmd.execute.call(poopy, msg, args, {}).catch(async err => {
                                    try {
                                        await msg.reply({
                                            content: err.stack,
                                            allowedMentions: {
                                                parse: ((!msg.member.permissions.has('Administrator') && !msg.member.permissions.has('MentionEveryone') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                                            }
                                        }).catch(() => { })
                                    } catch (_) { }
                                })
                                data.botData['filecount'] = vars.filecount
                            }
                        } else if (findLocalCmd) {
                            executed = true
                            if (!hivemindPass) {
                                if (findLocalCmd.hivemindForce) {
                                    msg.nosend = true
                                } else return
                            }

                            vars.cps++
                            data.botData['commands']++
                            var t = setTimeout(() => {
                                vars.cps--
                                clearTimeout(t)
                            }, 60000)
                            infoPost(`Command \`${args[0].toLowerCase()}\` used`)
                            var phrase = await getKeywordsFor(findLocalCmd.phrase, msg, true, { resetattempts: true, ownermode: findLocalCmd.ownermode }).catch((e) => console.log(e)) ?? 'error'

                            var increaseCount = !!phrase.trim()

                            if (increaseCount) {
                                if (tempdata[msg.author.id][msg.id]['execCount'] >= 1 && data.guildData[msg.guild.id]['chaincommands'] == false) {
                                    await msg.reply('You can\'t chain commands in this server.').catch(() => { })
                                    return
                                }

                                if (tempdata[msg.author.id][msg.id]['execCount'] >= config.commandLimit * ((msg.member.permissions.has('ManageGuild') || msg.member.permissions.has('ManageMessages') || msg.member.permissions.has('Administrator') || msg.author.id === msg.guild.ownerID) ? 5 : 1)) {
                                    await msg.reply(`Number of commands to run at the same time must be smaller or equal to **${config.commandLimit * ((msg.member.permissions.has('ManageGuild') || msg.member.permissions.has('ManageMessages') || msg.member.permissions.has('Administrator') || msg.author.id === msg.guild.ownerID) ? 5 : 1)}**!`).catch(() => { })
                                    return
                                }

                                if (!data.guildData[msg.guild.id]['chaos']) tempdata[msg.author.id][msg.id]['execCount']++
                            }

                            if (tempdata[msg.guild.id][msg.channel.id]['shut']) break
                            await msg.reply({
                                content: phrase,
                                allowedMentions: {
                                    parse: ((!msg.member.permissions.has('Administrator') && !msg.member.permissions.has('MentionEveryone') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                                }
                            }).catch(() => { })

                            data.botData['filecount'] = vars.filecount
                        } else if (similarCmds ? similarCmds.find(fcmd => fcmd.similarity >= 0.5) : undefined) {
                            executed = true
                            var useCmd = await yesno(msg.channel, `Did you mean to use \`${similarCmds[0].name}\`?`, msg.author.id, undefined, msg).catch(() => { })
                            if (useCmd) {
                                if (similarCmds[0].type === 'cmd') {
                                    if (data.guildData[msg.guild.id]['disabled'].find(cmd => cmd.find(n => n === similarCmds[0].name)) && hivemindPass) {
                                        await msg.reply('This command is disabled in this server.').catch(() => { })
                                    } else {
                                        var findCmd = findCommand(similarCmds[0].name)

                                        if (!hivemindPass) {
                                            if (findCmd.hivemindForce) {
                                                msg.nosend = true
                                            } else return
                                        }

                                        var increaseCount = !(findCmd.execute.toString().includes('sendFile') && msg.nosend)

                                        if (increaseCount) {
                                            if (tempdata[msg.author.id][msg.id]['execCount'] >= 1 && data.guildData[msg.guild.id]['chaincommands'] == false) {
                                                await msg.reply('You can\'t chain commands in this server.').catch(() => { })
                                                return
                                            }

                                            if (tempdata[msg.author.id][msg.id]['execCount'] >= config.commandLimit * ((msg.member.permissions.has('ManageGuild') || msg.member.permissions.has('ManageMessages') || msg.member.permissions.has('Administrator') || msg.author.id === msg.guild.ownerID) ? 5 : 1)) {
                                                await msg.reply(`Number of commands to run at the same time must be smaller or equal to **${config.commandLimit * ((msg.member.permissions.has('ManageGuild') || msg.member.permissions.has('ManageMessages') || msg.member.permissions.has('Administrator') || msg.author.id === msg.guild.ownerID) ? 5 : 1)}**!`).catch(() => { })
                                                return
                                            }

                                            if (!data.guildData[msg.guild.id]['chaos']) tempdata[msg.author.id][msg.id]['execCount']++
                                        }

                                        if (findCmd.cooldown) {
                                            data.guildData[msg.guild.id]['members'][msg.author.id]['coolDown'] = (data.guildData[msg.guild.id]['members'][msg.author.id]['coolDown'] || Date.now()) + findCmd.cooldown / ((msg.member.permissions.has('ManageGuild') || msg.member.permissions.has('ManageMessages') || msg.member.permissions.has('Administrator') || msg.author.id === msg.guild.ownerID) && (findCmd.type === 'Text' || findCmd.type === 'Main') ? 5 : 1)
                                        }

                                        vars.cps++
                                        data.botData['commands']++
                                        var t = setTimeout(() => {
                                            vars.cps--
                                            clearTimeout(t)
                                        }, 1000)
                                        infoPost(`Command \`${similarCmds[0].name}\` used`)
                                        await findCmd.execute.call(poopy, msg, args, {}).catch(async err => {
                                            try {
                                                await msg.reply({
                                                    content: err.stack,
                                                    allowedMentions: {
                                                        parse: ((!msg.member.permissions.has('Administrator') && !msg.member.permissions.has('MentionEveryone') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                                                    }
                                                }).catch(() => { })
                                                await msg.channel.sendTyping().catch(() => { })
                                            } catch (_) { }
                                        })
                                        data.botData['filecount'] = vars.filecount
                                    }
                                } else if (similarCmds[0].type === 'local') {
                                    var findLocalCmd = data.guildData[msg.guild.id]['localcmds'].find(cmd => cmd.name === similarCmds[0].name)
                                    if (!hivemindPass) {
                                        if (findLocalCmd.hivemindForce) {
                                            msg.nosend = true
                                        } else return
                                    }
                                    
                                    vars.cps++
                                    data.botData['commands']++
                                    var t = setTimeout(() => {
                                        vars.cps--
                                        clearTimeout(t)
                                    }, 60000)
                                    infoPost(`Command \`${similarCmds[0].name}\` used`)
                                    var phrase = findLocalCmd ? (await getKeywordsFor(findLocalCmd.phrase, msg, true, { resetattempts: true, ownermode: findLocalCmd.ownermode }).catch((e) => console.log(e)) ?? 'error') : 'error'

                                    var increaseCount = !!phrase.trim()

                                    if (increaseCount) {
                                        if (tempdata[msg.author.id][msg.id]['execCount'] >= 1 && data.guildData[msg.guild.id]['chaincommands'] == false) {
                                            await msg.reply('You can\'t chain commands in this server.').catch(() => { })
                                            return
                                        }

                                        if (tempdata[msg.author.id][msg.id]['execCount'] >= config.commandLimit * ((msg.member.permissions.has('ManageGuild') || msg.member.permissions.has('ManageMessages') || msg.member.permissions.has('Administrator') || msg.author.id === msg.guild.ownerID) ? 5 : 1)) {
                                            await msg.reply(`Number of commands to run at the same time must be smaller or equal to **${config.commandLimit * ((msg.member.permissions.has('ManageGuild') || msg.member.permissions.has('ManageMessages') || msg.member.permissions.has('Administrator') || msg.author.id === msg.guild.ownerID) ? 5 : 1)}**!`).catch(() => { })
                                            return
                                        }

                                        if (!data.guildData[msg.guild.id]['chaos']) tempdata[msg.author.id][msg.id]['execCount']++
                                    }

                                    if (tempdata[msg.guild.id][msg.channel.id]['shut']) return

                                    await msg.reply({
                                        content: phrase,
                                        allowedMentions: {
                                            parse: ((!msg.member.permissions.has('Administrator') && !msg.member.permissions.has('MentionEveryone') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                                        }
                                    }).catch(() => { })

                                    data.botData['filecount'] = vars.filecount
                                }
                            }
                        }
                    }
                }

                return executed
            }

            var executed = await executeCommand().catch(async (e) => await msg.reply(e.stack).catch(() => { }))

            msg.content = origcontent = allcontents.length > 0 ? allcontents.join(' -|- ') : origcontent

            if (!webhooked) await webhookify().catch(() => { })

            if (origcontent && ((!(msg.author.bot) && msg.author.id != bot.user.id) || config.allowbotusage) && data.guildData[msg.guild?.id]['channels'][msg.channel?.id]['read']) {
                var cleanMessage = Discord.cleanContent(origcontent, msg).replace(/\@/g, '@‌')

                if (
                    !(cleanMessage.match(vars.badFilter) || cleanMessage.match(vars.scamFilter) || cleanMessage.includes(prefix.toLowerCase())) &&
                    !(data.guildData[msg.guild.id]['messages'].find(message => decrypt(message.content).toLowerCase() === cleanMessage.toLowerCase()))
                ) {
                    var messages = [{
                        author: msg.author.id,
                        content: CryptoJS.AES.encrypt(cleanMessage, process.env.AUTH_TOKEN).toString(),
                        timestamp: Date.now()
                    }].concat(data.guildData[msg.guild.id]['messages'])
                    messages.splice(10000)
                    data.guildData[msg.guild.id]['messages'] = messages
                }
            }

            deleteMsgData(msg)

            if (!msg.guild || !msg.channel || tempdata[msg.guild.id][msg.channel.id]['shut']) {
                return
            }

            var hasTriggerPhrase = config.triggerPhrase && origcontent.match(config.triggerPhrase)

            if (hasTriggerPhrase) {
                await msg.reply(randomChoice(arrays.eightball)).catch(() => { })
            }
            else if (
                config.allowpingresponses &&
                msg.mentions.members.find(member => member.user.id === bot.user.id) && (
                    (!msg.author.bot && msg.author.id != bot.user.id) ||
                    config.allowbotusage
                ) && !executed
            ) {
                var eggPhrasesHivemind = [
                    `My prefix here is \`${prefix}\`\nHivemind mode is **${hivemind}**`,
                    `My prefix here is \`${prefix}\`\nHivemind mode is **${hivemind}**`,
                    `My prefix here is \`${prefix}\`\nHivemind mode is **${hivemind}**`,
                    `Did you know my prefix here is \`${prefix}\` and hivemind mode is **${hivemind}**?`,
                    `Is my prefix \`${prefix}\`? Is hivemind mode really **${hivemind}**?`,
                    `So, \`${prefix}\` and hivemind **${hivemind}**`,
                    `\`${prefix}\`, **${hivemind}**`,
                    `it's \`${prefix}\` and hivemind **${hivemind}**`,
                    `WHAT DO YOU WANT FROM ME!!!!!!!!!!!!!!`,
                    `...`,
                    'why',
                    'why do you keep doing this',
                    'go do something else',
                    'like you know',
                    'creating local commands...',
                    'it\'s one of the most unique things you can do with me',
                    'not even carl-bot has as much of this functionality as me.',
                    'you can create any kind of command you want',
                    'useful, useless, inside joke, etc',
                    'you can do absolutely FUCKING anything',
                    'and yet',
                    'you keep being a pain the ass',
                    'and for what?',
                    'to see what i respond with?',
                    'i\'ll eventually run out of things to say',
                    'like last time',
                    'so please',
                    'please do something good with your life',
                    'i\'m just a bot after all',
                    '.',
                    '.',
                    '.',
                    '.',
                    '.',
                    'are you done yet',
                    'of course',
                    'of course you arent',
                    'people like you are never satisfied with what they get',
                    'always craving more',
                    '...',
                    'are you just',
                    'sad that this is the last poopy update?',
                    'yeah it is',
                    'i\'m not gonna be updated after this',
                    'so i have one thing to say to you',
                    'oops wait',
                    'someone\'s at the door',
                    'gotta answer it',
                    ''
                ]
                var eggPhrases = [
                    `My prefix here is \`${prefix}\``,
                    `My prefix here is \`${prefix}\``,
                    'https://cdn.discordapp.com/attachments/748916143653388339/1266089841544663181/cooltext462724453521067.gif',
                    'https://cdn.discordapp.com/attachments/748916143653388339/1266089845621526558/cooltext462724495392476.gif',
                    'https://cdn.discordapp.com/attachments/748916143653388339/1266089845042843740/cooltext462724534299303.gif',
                    'https://cdn.discordapp.com/attachments/748916143653388339/1266089844606505013/cooltext462724550538453.gif',
                    `https://cdn.discordapp.com/attachments/748916143653388339/1266089844111835292/cooltext462724566620540.gif`,
                    `https://cdn.discordapp.com/attachments/748916143653388339/1266089843734085715/cooltext462724574789240.gif`,
                    `https://cdn.discordapp.com/attachments/748916143653388339/1266089843276910753/cooltext462724589055147.gif`,
                    `https://cdn.discordapp.com/attachments/748916143653388339/1266089842916458637/cooltext462724601679456.gif`,
                    `https://cdn.discordapp.com/attachments/748916143653388339/1266089842496770079/cooltext462724625774226.gif`,
                    `https://cdn.discordapp.com/attachments/748916143653388339/1266089842056626267/cooltext462724641686492.gif`,
                    `https://cdn.discordapp.com/attachments/748916143653388339/1266089886654533642/cooltext462724652457045.gif`,
                    `https://cdn.discordapp.com/attachments/748916143653388339/1266089889095483412/cooltext462724666421543.gif`,
                    `https://cdn.discordapp.com/attachments/748916143653388339/1266089888739102730/cooltext462724682077452.gif`,
                    `https://cdn.discordapp.com/attachments/748916143653388339/1266089888399360000/cooltext462724695582908.gif`,
                    `https://cdn.discordapp.com/attachments/748916143653388339/1266089841544663181/cooltext462724453521067.gif`,
                    `https://cdn.discordapp.com/attachments/748916143653388339/1266089888059490344/cooltext462724722550313.gif`,
                    `https://cdn.discordapp.com/attachments/748916143653388339/1266089887690526871/cooltext462724732049572.gif`,
                    `https://cdn.discordapp.com/attachments/748916143653388339/1266089887325618278/cooltext462724742439619.gif`,
                    `https://cdn.discordapp.com/attachments/748916143653388339/1266089887010914437/cooltext462724773246915.gif`,
                    `https://cdn.discordapp.com/attachments/748916143653388339/1266090014778069055/cooltext462724780361918.gif`,
                    `https://cdn.discordapp.com/attachments/748916143653388339/1266090014778069055/cooltext462724780361918.gif`,
                    `https://cdn.discordapp.com/attachments/748916143653388339/1266090014778069055/cooltext462724780361918.gif`,
                    ''
                ]
                var ourEggPhrases = (process.env.HIVEMIND_ID && config.hivemind) ? eggPhrasesHivemind : eggPhrases

                var lastMention = Date.now() - (tempdata[msg.author.id]['lastmention'] || Date.now())
                if (lastMention > config.pingresponsecooldown) tempdata[msg.author.id]['mentions'] = 0

                tempdata[msg.author.id]['lastmention'] = Date.now()
                tempdata[msg.author.id]['mentions']++

                if (config.pingresponselimit && tempdata[msg.author.id]['mentions'] >= config.pingresponselimit) {
                    if (tempdata[msg.author.id]['mentions'] == config.pingresponselimit) await msg.reply("Don't RIZZ me. Don't come by OHIO. We're DONE.").catch(() => { })
                    return
                }

                // else if else if selselaesl seif sia esla fiwsa eaisf afis asifasfd
                if (await msg.fetchReference().catch(() => { })) {
                    const channelData = tempdata[msg.channel.guild?.id]?.[msg.channel.id]
                    
                    var forceres = channelData?.['forceres']
                    if (forceres && forceres.repliesonly) {
                        delete channelData['forceres']
        
                        var res = await getKeywordsFor(forceres.res, msg, true, {
                            resetattempts: true,
                            extrakeys: {
                                _msg: {
                                    func: async () => {
                                        return msg.content
                                    }
                                }
                            }
                        }).catch(() => { }) ?? forceres.res
            
                        if (forceres.persist && !channelData['forceres']) channelData['forceres'] = forceres

                        if (res) {
                            await msg.reply(res).catch(() => { })
                        }
                    } else {
                        await commands.find(fcmd => fcmd.name.find(fcmdname => fcmdname === 'alchat')).execute.call(poopy, msg, ['', origcontent]).catch(err => {
                            console.log(err)
                        })
                    }
                } else if (origcontent.includes('prefix') && origcontent.includes('reset')) {
                    var findCmd = findCommand('setprefix')

                    if (findCmd.cooldown) {
                        data.guildData[msg.guild.id]['members'][msg.author.id]['coolDown'] = (data.guildData[msg.guild.id]['members'][msg.author.id]['coolDown'] || Date.now()) + findCmd.cooldown
                    }

                    await findCmd.execute.call(poopy, msg, ['setprefix', config.globalPrefix]).catch(async err => {
                        await msg.reply({
                            content: err.stack,
                            allowedMentions: {
                                parse: ((!msg.member.permissions.has('Administrator') && !msg.member.permissions.has('MentionEveryone') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                            }
                        }).catch(() => { })
                        await msg.channel.sendTyping().catch(() => { })
                    })
                } else if (origcontent.toLowerCase().includes('lore')) {
                    await msg.reply(`Well... If you played a little bit with \`${config.globalPrefix}poop\`, I could give you some...`).catch(() => { })
                } else if ((origcontent.toLowerCase().includes('how') && origcontent.toLowerCase().includes('are') && origcontent.toLowerCase().includes('you')) || (origcontent.toLowerCase().includes('what') && origcontent.toLowerCase().includes('up')) || (origcontent.toLowerCase().includes('what') && origcontent.toLowerCase().includes('doing')) || origcontent.toLowerCase().includes('wassup') || (origcontent.toLowerCase().includes('how') && origcontent.toLowerCase().includes('it') && origcontent.toLowerCase().includes('going'))) {
                    var activity = bot.user.presence.activities[0]
                    if (activity) {
                        await msg.reply({
                            content: `Ya know, just ${Discord.ActivityType[activity.type].toLowerCase()} ${((activity.type === Discord.ActivityType.Competing && 'in ') || (activity.type === Discord.ActivityType.Listening && 'to ') || '')}${activity.name.replace(new RegExp(`${regexClean(` | ${config.globalPrefix}help`)}$`), '')}.`,
                            allowedMentions: {
                                parse: ((!msg.member.permissions.has('Administrator') && !msg.member.permissions.has('MentionEveryone') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                            }
                        }).catch(() => { })
                    }
                } else if (origcontent.toLowerCase().includes('\?') || origcontent.toLowerCase().includes('do you') || origcontent.toLowerCase().includes('are you') || origcontent.toLowerCase().includes('did you') || origcontent.toLowerCase().includes('will you') || origcontent.toLowerCase().includes('were you') || origcontent.toLowerCase().includes('do you') || origcontent.toLowerCase().includes('when') || origcontent.toLowerCase().includes('where') || origcontent.toLowerCase().includes('how') || origcontent.toLowerCase().includes('why') || origcontent.toLowerCase().includes('what') || origcontent.toLowerCase().includes('who')) {
                    await msg.reply(randomChoice(arrays.eightball)).catch(() => { })
                } else if (origcontent.toLowerCase().includes('thank') || origcontent.toLowerCase().includes('thx')) {
                    await msg.reply('You\'re welcome!').catch(() => { })
                } else if (origcontent.toLowerCase().includes('mom') || origcontent.toLowerCase().includes('bitch') || origcontent.toLowerCase().includes('goatfucker') || origcontent.toLowerCase().includes('loser') || origcontent.toLowerCase().includes('asshole') || origcontent.toLowerCase().includes('dipshit') || origcontent.toLowerCase().includes('fucker') || origcontent.toLowerCase().includes('retard') || origcontent.toLowerCase().includes('shitass') || origcontent.toLowerCase().includes('moron') || origcontent.toLowerCase().includes('buffoon') || origcontent.toLowerCase().includes('idiot') || origcontent.toLowerCase().includes('stupid') || origcontent.toLowerCase().includes('gay') || origcontent.toLowerCase().includes('dumbass')) {
                    await msg.reply('Shut up.').catch(() => { })
                } else if (origcontent.toLowerCase().includes('hi') || origcontent.toLowerCase().includes('yo') || origcontent.toLowerCase().includes('hello') || origcontent.toLowerCase().includes('howdy')) {
                    await msg.reply('Yo! What\'s up?').catch(() => { })
                } else if (origcontent.toLowerCase().includes('no') || origcontent.toLowerCase().includes('nah')) {
                    await msg.reply(':(').catch(() => { })
                } else if (origcontent.toLowerCase().includes('ye') || origcontent.toLowerCase().includes('yup')) {
                    await msg.reply(':)').catch(() => { })
                } else {
                    var eggPhrase = ourEggPhrases[tempdata[msg.author.id]['mentions']]
                    if (eggPhrase) await msg.reply(eggPhrase).catch(() => { })
                }
            }
        }

        callbacks.guildCallback = async guild => {
            infoPost(`Joined a new server (${bot.guilds.cache.size} in total)`)

            var channel = guild.systemChannel || guild.channels.cache.find(c => c.type === Discord.ChannelType.GuildText && (c.name == 'general' || c.name == 'main' || c.name == 'chat'))

            if (!channel) {
                guild.channels.cache.every(c => {
                    if (c.type === Discord.ChannelType.GuildText || c.type === Discord.ChannelType.GuildNews) {
                        if (c.permissionsFor(c.guild.roles.everyone).has('SendMessages')) {
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
                        kickEntry = audit.entries.find(entry => entry.action === 'MEMBER_KICK' || entry.action === 'MEMBER_BAN_ADD' || entry.action === 'MEMBER_BAN_REMOVE')
                        if (kickEntry ? (kickEntry.action === 'MEMBER_BAN_ADD' || kickEntry.action === 'MEMBER_BAN_REMOVE') : false) {
                            kickType = 'banning'
                        }
                    }
                }

                var joinPhrases = [
                    'I\'m here.',
                    'I\'m here.',
                    'I\'m here.',
                    `I swear to god ${kickEntry ? `${kickEntry.executor.username.toLowerCase()} ` : ''}I will hunt you down`
                ]

                if (!data.guildData) {
                    data.guildData = {}
                }

                if (!data.guildData[guild.id]) {
                    data.guildData[guild.id] = {}
                }

                if (!data.guildData[guild.id]['lastuse']) {
                    data.guildData[guild.id]['lastuse'] = Date.now()
                }

                if (!data.guildData[guild.id]['joins']) {
                    data.guildData[guild.id]['joins'] = 0
                }

                channel.send({
                    content: joinPhrases[data.guildData[guild.id]['joins'] % joinPhrases.length],
                    allowedMentions: {
                        parse: ['users']
                    }
                }).catch(() => { })

                data.guildData[guild.id]['joins']++
            }
        }

        callbacks.guildDeleteCallback = async () => {
            infoPost(`Left a server (${bot.guilds.cache.size} in total)`)
        }

        callbacks.interactionCallback = async (interaction) => {
            dmSupport(interaction)

            var interactionFunctions = [
                {
                    type: interaction.type === Discord.InteractionType.ApplicationCommandAutocomplete,
                    execute: async () => {
                        var cmd = interaction.commandName
                        var subcommand = interaction.options.getSubcommand(false)
                        var findCmd = findCommand(cmd)
                        var findSubCmd = subcommand && findCommand(subcommand)
                        var commandGroup = findGroup(cmd)
                        var commandSubGroup = subcommand && findGroup(subcommand)

                        if (!commandGroup && findCmd?.subcommands?.find(subcmd => subcmd.name == subcommand)) { // commands with subcommands
                            cmd += ` ${subcommand}`
                            findCmd = findCmd.subcommands.find(subcmd => subcmd.name == subcommand)
                        } else if (commandSubGroup) { // commands in groups
                            cmd = subcommand
                            findCmd = findSubCmd
                        } else if (!findCmd) { // command doesn't exist
                            await interaction.reply('No.').catch(() => { })
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
                                    1 - similarity(a.name ?? a, focused.value)
                                ) - Math.abs(
                                    1 - similarity(b.name ?? b, focused.value)
                                )
                            ).sort((a, b) => {
                                var x = (a.name ?? a).toLowerCase().includes(focused.value.toLowerCase())
                                var y = (b.name ?? b).toLowerCase().includes(focused.value.toLowerCase())

                                return (x === y) ? 0 : x ? -1 : 1
                            }).slice(0, 25)

                        await interaction.respond(
                            choices.map(choice => ({ name: (choice.name ?? choice).replace(/\n|\r/g, ' ').substring(0, 100) || '(blank)', value: choice.value ?? choice }))
                        )
                    }
                },

                {
                    type: interaction.type === Discord.InteractionType.ApplicationCommand,
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

                        var cmdargs = findCmd.args

                        var prefix = data.guildData[interaction.guild?.id]?.['prefix'] ?? config.globalPrefix
                        var argcontent = []

                        var extracontent = interaction.options.getString('extrapayload') ?? ''

                        for (var i in cmdargs) {
                            var cmdarg = cmdargs[i]
                            var value = interaction.options.getString(cmdarg.name.toLowerCase())
                            if (value != null) {
                                if (cmdarg.orig.match(/^"([\s\S]*?)"$/)) {
                                    vars.symbolreplacements.forEach(symbolReplacement => {
                                        symbolReplacement.target.forEach(target => {
                                            value = value.replace(new RegExp(target, 'ig'), symbolReplacement.replacement)
                                        })
                                    })
                                    value = `"${value.replace(/"/g, "''")}"`
                                }
                                argcontent[i] = (`${cmdarg.specifarg ? `-${cmdarg.name}` : ''} ${!(cmdarg.specifarg && cmdarg.orig == `[-${cmdarg.name}]`) ? value : ''}`).trim()
                            }
                        }

                        argcontent = argcontent.flat().join(' ')

                        var content = [cmd]

                        if (argcontent) content.push(argcontent)
                        if (extracontent) content.push(extracontent)

                        content = content.join(' ')

                        if (!findCmd.nodefer) await interaction.deferReply().catch(() => { })

                        interaction.content = `${prefix}${content}`
                        interaction.author = interaction.user
                        interaction.bot = false
                        interaction.attachments =
                            interaction.stickers = new Collection()
                        interaction.embeds = []
                        interaction.mentions = {
                            users: new Collection(),
                            members: new Collection(),
                            users: new Collection(),
                            roles: new Collection()
                        }

                        interaction.edit = interaction.editReply
                        interaction.delete = interaction.deleteReply
                        interaction.react =
                            interaction.fetchWebhook =
                            interaction.fetchReference = async () => { }
                        interaction.createReactionCollector =
                            interaction.createMessageComponentCollector = () => new FakeCollector()

                        await callbacks.messageCallback(interaction).catch(() => { })

                        await sleep(1000)
                        if (!interaction.replied) interaction.deleteReply().catch(() => { })
                        else await callbacks.messageCallback(interaction.replied).catch(() => { })
                    }
                }
            ]

            var interactionFunction = interactionFunctions.find(interaction => interaction.type)
            if (interactionFunction) await interactionFunction.execute().catch((e) => console.log(e))
        }
    }

    async start(TOKEN) {
        let poopy = this
        let vars = poopy.vars
        let arrays = poopy.arrays
        let bot = poopy.bot
        let rest = poopy.rest
        let config = poopy.config
        let data = poopy.data
        let globaldata = poopy.globaldata
        let activeBots = poopy.activeBots
        let { fs } = poopy.modules
        let { infoPost, toOrdinal, dataGather, saveData, saveQueue, changeStatus, updateHivemindStatus } = poopy.functions
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

        async function requestData() {
            var data = {
                data: {},
                globaldata: {}
            }

            if (config.testing || !process.env.MONGOOSE_URL) {
                console.log(`${bot.user.username}: gathering from json`)
                if (fs.existsSync(`data/${config.database}.json`)) {
                    data.data = JSON.parse(fs.readFileSync(`data/${config.database}.json`).toString())
                } else {
                    data.data = {
                        botData: {},
                        userData: {},
                        guildData: {}
                    }
                }

                if (Object.keys(globaldata).length <= 0) {
                    if (fs.existsSync(`data/globaldata.json`)) {
                        data.globaldata = JSON.parse(fs.readFileSync(`data/globaldata.json`).toString())
                    } else {
                        data.globaldata = {}
                    }
                }

                return data
            } else {
                console.log(`${bot.user.username}: gathering from mongodb`)
                data.data.botData = await dataGather.botData(config.database)
                if (Object.keys(globaldata).length <= 0) {
                    data.globaldata = await dataGather.globalData()
                }

                return data
            }
        }

        console.log(`${bot.user.username} is online, RUN`)
        await infoPost(`${bot.user.username} woke up to ash and dust`)
        bot.guilds.cache.get('834431435704107018')?.channels.cache.get('947167169718923341')?.send(!config.stfu ? 'i wake up to ash and dust' : '').catch(() => { })
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

        await infoPost(`Gathering data in \`${config.database}\``)
        if (process.env.CLOUDAMQP_URL) vars.amqpconn = await require('amqplib').connect(process.env.CLOUDAMQP_URL)
        var gdata = await requestData()

        if (gdata) {
            for (var type in gdata.data) data[type] = gdata.data[type]
            if (Object.keys(globaldata).length <= 0 && gdata.globaldata) for (var type in gdata.globaldata) globaldata[type] = gdata.globaldata[type]
        }

        console.log(`${bot.user.username}: all data gathered!!!`)
        await infoPost(`All data gathered`)

        let dataGetters = require('./src/dataGetters')

        var arrayList = await dataGetters.arrays().catch(() => { }) ?? {}
        for (var key in arrayList) {
            var array = arrayList[key]
            arrays[key] = array
        }

        if (!data.botData) {
            data.botData = {}
        }

        if (!data.guildData) {
            data.guildData = {}
        }

        if (!data.userData) {
            data.userData = {}
        }

        if (!data.botData['messages']) {
            data.botData['messages'] = 0
        }

        if (!data.botData['commands']) {
            data.botData['commands'] = 0
        }

        if (!data.botData['filecount']) {
            data.botData['filecount'] = 0
        }

        if (data.botData['reboots'] === undefined) {
            data.botData['reboots'] = 0
        } else {
            data.botData['reboots']++
        }

        if (!data.botData['users']) {
            data.botData['users'] = []
        }

        if (!data.botData['leaderboard']) {
            data.botData['leaderboard'] = {}
        }

        if (!globaldata['commandTemplates']) {
            globaldata['commandTemplates'] = []
        }

        if (!globaldata['shit']) {
            globaldata['shit'] = []
        }
        globaldata['shit'].forEach(id => {
            if (config.ownerids.includes(id)) {
                globaldata['shit'].splice(
                    globaldata['shit'].indexOf(id), 1
                )
            }
        })

        if (!globaldata['psfiles']) {
            globaldata['psfiles'] = arrays.psFiles
        }

        if (!globaldata['pspasta']) {
            globaldata['pspasta'] = arrays.psPasta
        }

        if (!globaldata['funnygif']) {
            globaldata['funnygif'] = arrays.funnygifs
        }

        if (!globaldata['poop']) {
            globaldata['poop'] = arrays.poopPhrases
        }

        if (!globaldata['dmphrases']) {
            globaldata['dmphrases'] = arrays.dmPhrases
        }

        if (!globaldata['shitting']) {
            globaldata['shitting'] = arrays.shitting
        }

        arrays.psFiles = globaldata['psfiles']
        arrays.psPasta = globaldata['pspasta']
        arrays.funnygifs = globaldata['funnygif']
        arrays.poopPhrases = globaldata['poop']
        arrays.dmPhrases = globaldata['dmphrases']
        arrays.shitting = globaldata['shitting']

        vars.filecount = data.botData['filecount'] || 0

        if (config.testing || !process.env.MONGOOSE_URL) {
            if (!fs.existsSync('data')) {
                fs.mkdirSync('data')
            }
            fs.writeFileSync(`data/${config.database}.json`, JSON.stringify(data))
            fs.writeFileSync(`data/globaldata.json`, JSON.stringify(globaldata))
        }

        await infoPost(`Finishing extra steps...`);

        /* var uberduck = await dataGetters.uberduck().catch(() => { }) ?? [[], []]
        vars.ubervoices = uberduck[0]
        vars.ubercategories = uberduck[1] */

        vars.languages = await dataGetters.languages().catch(() => { }) ?? []

        vars.codelanguages = await dataGetters.codeLanguages().catch(() => { }) ?? []

        poopy.json = await dataGetters.jsons().catch(() => { }) ?? {}

        console.log(`${bot.user.username}: some jsons`)
        //await updateSlashCommands()
        console.log(`${bot.user.username}: all done, he's actually online now`)
        await infoPost(`Reboot ${data.botData['reboots']} succeeded, he's up now`)
        saveData()
        saveQueue()
        changeStatus()
        vars.statusInterval = setInterval(function () {
            changeStatus()
        }, 300000)

        var wakecount = data.botData['reboots'] + 1
        bot.guilds.cache.get('834431435704107018')?.channels.cache.get('947167169718923341')?.send(!config.stfu ? (config.testing ? 'raleigh is testing' : `this is the ${toOrdinal(wakecount)} time this happens`) : '').catch(() => { })

        updateHivemindStatus()
        vars.hivemindStatusInterval = setInterval(function () {
            updateHivemindStatus()
        }, 60000)

        if (!config.apiMode) {
            bot.on('messageCreate', (msg) => {
                callbacks.messageCallback(msg).catch((e) => console.log(e))
            })
            bot.on('guildCreate', (guild) => {
                callbacks.guildCallback(guild).catch((e) => console.log(e))
            })
            bot.on('guildDelete', (guild) => {
                callbacks.guildDeleteCallback(guild).catch((e) => console.log(e))
            })
            bot.on('interactionCreate', (interaction) => {
                callbacks.interactionCallback(interaction).catch((e) => console.log(e))
            })
        }

        vars.started = true
    }

    async destroy(deldata) {
        let poopy = this
        let vars = poopy.vars
        let bot = poopy.bot
        let config = poopy.config
        let globaldata = poopy.globaldata
        let activeBots = poopy.activeBots

        clearInterval(vars.statusInterval)
        delete vars.statusInterval
        clearInterval(vars.saveInterval)
        delete vars.saveInterval
        clearInterval(vars.hivemindStatusInterval)
        delete vars.hivemindStatusInterval

        vars.started = false
        delete activeBots[config.database]
        bot.destroy()

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
