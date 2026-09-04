module.exports = {
    name: ['removefromjson'],
    args: [{
        name: "json", required: true, specifarg: false, orig: "<json (funnygif, poop, dmphrases, shitting, outsidemedia, eightball)>", autocomplete: [
            'funnygif',
            'poop',
            'dmphrases',
            'shitting',
            'outsidemedia',
            'eightball'
        ]
    }, { name: "value", required: true, specifarg: false, orig: "<value>" }],
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
            var groupInfo = usesGroups && globaldata[type].find(g => g.list.find(v => v === saidMessage))
            var soExtra = (usesGroups && groupInfo && ` (${groupInfo.displayname})`) || '' 

            var alreadyExists = usesGroups
                ? groupInfo
                : globaldata[type].find(v => v === saidMessage)

            if (!alreadyExists) {
                await msg.reply('Does not exist.').catch(() => { })
                return
            }

            var array = (usesGroups ? groupInfo.list : globaldata[type])
            var removed = array.splice(array.findIndex(v => v === saidMessage), 1)

            if (!msg.nosend) await msg.reply({
                content: '✅ Removed ' + removed[0] + soExtra,
                allowedMentions: fetchPingPerms(msg)
            }).catch(() => { })

            arrays.funnygifs = globaldata.funnygif
            arrays.poopPhrases = globaldata.poop
            arrays.dmPhrases = globaldata.dmphrases
            arrays.shitting = globaldata.shitting
            arrays.outsideMedia = globaldata.outsidemedia
            arrays.eightball = globaldata.eightball

            return '✅ Removed ' + removed[0] + soExtra
        };
    },
    help: {
        name: 'removefromjson <json (funnygif, poop, dmphrases, shitting, outsidemedia, eightball)> <value>',
        value: "Removes a value from JSONs like oil or DM phrases."
    },
    cooldown: 2500,
    type: 'JSON Gang'
}
