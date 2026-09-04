module.exports = {
    name: ['addtojson'],
    args: [{
        name: "json", required: true, specifarg: false, orig: "<json (funnygif, poop, dmphrases, shitting, outsidemedia, eightball)>", autocomplete: [
            'funnygif',
            'poop',
            'dmphrases',
            'shitting',
            'outsidemedia',
            'eightball'
        ]
    }, { name: "value", required: true, specifarg: false, orig: "<value>" },
    { name: "group", required: false, specifarg: false, orig: "[group (ONLY for outsidemedia json; short name for the community)]" }],
    execute: async function (msg, args) {
        let poopy = this
        let config = poopy.config
        let globaldata = poopy.globaldata
        let arrays = poopy.arrays
        let { fetchPingPerms } = poopy.functions

        var jsonid = config.ownerids.find(id => id == msg.author.id) || config.jsoning.find(id => id == msg.author.id);
        if (jsonid === undefined) {
            await msg.reply('Sorry... You\'re not in the JSON gang.').catch(() => { })
            return
        } else {
            var types = ['funnygif', 'poop', 'dmphrases', 'shitting', 'outsidemedia', 'eightball']

            if (args[1] === undefined) {
                await msg.reply(`What is the JSON to update?! (Available: ${types.map(t => `**${t}**`).join(', ')})`).catch(() => { })
                return;
            } else if (args[2] === undefined) {
                await msg.reply('What is the value?!').catch(() => { })
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
            var saidMessage = args.slice(2).join(' ')

            var usesGroups = type === 'outsidemedia'
            var group = args[3]
            var groupInfo = usesGroups && group && globaldata[type].find(g => g.name === group)
            var soExtra = (usesGroups && groupInfo && ` (${groupInfo.displayname})`) || '' 

            var alreadyExists = usesGroups
                ? globaldata[type].find(g => g.list.find(v => v === saidMessage))
                : globaldata[type].find(v => v === saidMessage)

            if (alreadyExists) {
                await msg.reply('Already exists.' + (usesGroups && ` (${alreadyExists.displayname})` || '')).catch(() => { })
                return
            }

            if (usesGroups && group === undefined) {
                await msg.reply(`What is the group it should be put in?! (Available: ${globaldata[type].map(g => `**${g.name}**`).join(', ')})`)
                return;
            }

            if (usesGroups && group !== undefined && !groupInfo) {
                await msg.reply(`\`${group}\` is not a valid group! (Available: ${globaldata[type].map(g => `**${g.name}**`).join(', ')})`)
                return;
            }

            groupInfo.list.push(saidMessage)

            if (!msg.nosend) await msg.reply({
                content: '✅ Added ' + saidMessage + soExtra,
                allowedMentions: fetchPingPerms(msg)
            }).catch(() => { })

            arrays.funnygifs = globaldata.funnygif
            arrays.poopPhrases = globaldata.poop
            arrays.dmPhrases = globaldata.dmphrases
            arrays.shitting = globaldata.shitting
            arrays.outsideMedia = globaldata.outsidemedia
            arrays.eightball = globaldata.eightball

            return '✅ Added ' + saidMessage + soExtra
        };
    },
    help: {
        name: 'addtojson <json (funnygif, poop, dmphrases, shitting, outsidemedia, eightball)> <value> [group (ONLY for outsidemedia json; short name for the community)]',
        value: "Adds a new value to JSONs like oil or DM phrases."
    },
    cooldown: 2500,
    type: 'JSON Gang'
}
