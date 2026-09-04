module.exports = {
    name: ['displayjson'],
    args: [{
        name: "json", required: true, specifarg: false, orig: "<json (funnygif, poop, dmphrases, shitting, outsidemedia, eightball)>", autocomplete: [
            'funnygif',
            'poop',
            'dmphrases',
            'shitting',
            'outsidemedia',
            'eightball'
        ]
    }, { name: "group", required: false, specifarg: false, orig: "[group (ONLY for outsidemedia json; short name for the community)]" }],
    execute: async function (msg, args) {
        let poopy = this
        let config = poopy.config
        let vars = poopy.vars
        let { fs, Discord } = poopy.modules
        let globaldata = poopy.globaldata

        var jsonid = config.ownerids.find(id => id == msg.author.id) || config.jsoning.find(id => id == msg.author.id);
        if (jsonid === undefined) {
            await msg.reply('Sorry... You\'re not in the JSON gang.').catch(() => { })
            return
        } else {
            var types = ['funnygif', 'poop', 'dmphrases', 'shitting', 'outsidemedia', 'eightball']

            if (args[1] === undefined) {
                await msg.reply(`What is the JSON to display?! (Available: ${types.map(t => `**${t}**`).join(', ')})`).catch(() => { })
                return;
            }

            var type
            var isSecret = (process.env.SECRET_ARG && config.tumoreTesters.includes(msg.author.id) && args[1].toLowerCase() == process.env.SECRET_ARG)

            if (types.find(t => t === args[1].toLowerCase()) || isSecret) {
                type = isSecret ? "secretShit" : args[1].toLowerCase()
            } else {
                await msg.reply('Not a JSON type.').catch(() => { })
                return
            }

            var usesGroups = type === 'outsidemedia'
            var group = args[2]
            var groupInfo = usesGroups && group && globaldata[type].find(g => g.name === group)

            var array = usesGroups ? groupInfo && groupInfo.list : globaldata[type]
            if (usesGroups && array === undefined)
                array = globaldata[type].reduce((arr, groupInfo) => arr.concat(groupInfo.list), [])

            var result = array.join('\n\n-----------------------------------------------\n\n') || 'lmao theres nothing'

            var currentcount = vars.filecount
            vars.filecount++
            var filepath = `temp/${config.database}/file${currentcount}`
            fs.mkdirSync(filepath)
            fs.writeFileSync(`${filepath}/jsonlist.txt`, result)
            if (!msg.nosend) await msg.reply({
                files: [new Discord.AttachmentBuilder(`${filepath}/jsonlist.txt`)]
            }).catch(() => { })
            fs.rmSync(`${filepath}`, { force: true, recursive: true })

            return result
        };
    },
    help: {
        name: 'displayjson <json (funnygif, poop, dmphrases, shitting, outsidemedia, eightball)>',
        value: "Displays the values of a JSON like oil or DM phrases."
    },
    cooldown: 2500,
    type: 'JSON Gang'
}
