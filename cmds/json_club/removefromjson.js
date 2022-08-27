module.exports = {
    name: ['removefromjson'],
    args: [{
        "name": "json", "required": true, "specifarg": false, "orig": "<json (psfiles, pspasta, funnygif, poop, dmphrases)>", "autocomplete": [
            'psfiles',
            'pspasta',
            'funnygif',
            'poop',
            'dmphrases'
        ]
    }, { "name": "value", "required": true, "specifarg": false, "orig": "<value>" }],
    execute: async function (msg, args) {
        let poopy = this
        let config = poopy.config
        let globaldata = poopy.globaldata
        let arrays = poopy.arrays

        var jsonid = config.ownerids.find(id => id == msg.author.id) || config.jsoning.find(id => id == msg.author.id);
        if (jsonid === undefined) {
            await msg.reply('json club only').catch(() => { })
            return
        } else {
            var types = ['psfiles', 'pspasta', 'funnygif', 'poop', 'dmphrases']

            if (args[1] === undefined) {
                await msg.reply(`What is the JSON to update?! (Available: ${types.map(t => `**${t}**`).join(', ')})`).catch(() => { })
                return;
            } else if (args[2] === undefined) {
                await msg.reply('What is the value?!').catch(() => { })
                return;
            }

            var type

            if (types.find(t => t === args[1].toLowerCase())) {
                type = args[1].toLowerCase()
            } else {
                await msg.reply('Not a JSON type.').catch(() => { })
                return
            }
            var saidMessage = args.slice(2).join(' ')

            if (!globaldata['bot-data'][type].find(v => v === saidMessage)) {
                await msg.reply('Does not exist.').catch(() => { })
                return
            }

            var removed = globaldata['bot-data'][type].splice(globaldata['bot-data'][type].findIndex(v => v === saidMessage), 1)

            await msg.reply({
                content: '✅ Removed ' + removed[0],
                allowedMentions: {
                    parse: ((!msg.member.permissihas('ADMINISTRATOR') && !msg.member.permissihas('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                }
            }).catch(() => { })

            arrays.psFiles = globaldata['bot-data']['psfiles']
            arrays.psPasta = globaldata['bot-data']['pspasta']
            arrays.funnygifs = globaldata['bot-data']['funnygif']
            arrays.poopPhrases = globaldata['bot-data']['poop']
            arrays.dmPhrases = globaldata['bot-data']['dmphrases']
        };
    },
    help: {
        name: 'removefromjson <json (psfiles, pspasta, funnygif, poop, dmphrases)> <value>',
        value: "Removes a value from JSONs like Phexonia Studio's files."
    },
    cooldown: 2500,
    type: 'JSON Club'
}