module.exports = {
    name: ['updatefromjson'],
    args: [{
        name: "json", required: true, specifarg: false, orig: "<json (funnygif, poop, dmphrases, shitting, outsidemedia, eightball)>", autocomplete: [
            'funnygif',
            'poop',
            'dmphrases',
            'shitting',
            'outsidemedia',
            'eightball'
        ]
    }],
    execute: async function (msg, args) {
        let poopy = this
        let config = poopy.config
        let globaldata = poopy.globaldata
        let arrays = poopy.arrays
        let { fs } = poopy.modules
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
            }

            var type

            if (types.find(t => t === args[1].toLowerCase())) {
                type = args[1].toLowerCase()
            } else {
                await msg.reply('Not a JSON type.').catch(() => { })
                return
            }

            globaldata[type] = fs.readJSONSync(`src/json/${type}.json`)

            if (!msg.nosend) await msg.reply({
                content: '✅ JSON values updated from existing file.',
                allowedMentions: fetchPingPerms(msg)
            }).catch(() => { })

            arrays.funnygifs = globaldata.funnygif
            arrays.poopPhrases = globaldata.poop
            arrays.dmPhrases = globaldata.dmphrases
            arrays.shitting = globaldata.shitting
            arrays.outsideMedia = globaldata.outsidemedia
            arrays.eightball = globaldata.eightball

            return '✅ JSON values updated from existing file.'
        };
    },
    help: {
        name: 'updatefromjson <json (funnygif, poop, dmphrases, shitting, outsidemedia, eightball)>',
        value: "Updates from the bot's existing JSON files like oil or DM phrases."
    },
    cooldown: 2500,
    type: 'JSON Gang'
}