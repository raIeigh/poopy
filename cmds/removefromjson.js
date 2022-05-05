module.exports = {
    name: ['removefromjson'],
    execute: async function (msg, args) {
        let poopy = this

        var jsonid = poopy.config.ownerids.find(id => id == msg.author.id) || poopy.config.jsoning.find(id => id == msg.author.id);
        if (jsonid === undefined) {
            msg.channel.send('json club only').catch(() => { })
            return
        } else {
            var types = ['psfiles', 'pspasta', 'funnygif', 'poop', 'dmphrases']

            if (args[1] === undefined) {
                msg.channel.send(`What is the JSON to update?! (Available: ${types.map(t => `**${t}**`).join(', ')})`).catch(() => { })
                return;
            } else if (args[2] === undefined) {
                msg.channel.send('What is the value?!').catch(() => { })
                return;
            }

            var type

            if (types.find(t => t === args[1].toLowerCase())) {
                type = args[1].toLowerCase()
            } else {
                msg.channel.send('Not a JSON type.').catch(() => { })
                return
            }
            var saidMessage = args.join(' ').substring(args[0].length + args[1].length + 2)

            if (!poopy.functions.globalData()['bot-data'][type].find(v => v === saidMessage)) {
                msg.channel.send('Does not exist.').catch(() => { })
                return
            }

            poopy.functions.globalData()['bot-data'][type].splice(poopy.functions.globalData()['bot-data'][type].findIndex(v => v === saidMessage), 1)

            msg.channel.send({
                content: '✅ Removed.',
                allowedMentions: {
                    parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                }
            }).catch(() => { })

            poopy.arrays.psFiles = poopy.functions.globalData()['bot-data']['psfiles']
            poopy.arrays.psPasta = poopy.functions.globalData()['bot-data']['pspasta']
            poopy.arrays.funnygifs = poopy.functions.globalData()['bot-data']['funnygif']
            poopy.arrays.poopPhrases = poopy.functions.globalData()['bot-data']['poop']
            poopy.arrays.dmPhrases = poopy.functions.globalData()['bot-data']['dmphrases']
        };
    },
    help: {
        name: 'removefromjson <json (psfiles, pspasta, funnygif, poop, dmphrases)> <value>',
        value: "Removes a value from JSONs like Phexonia Studio's files."
    },
    cooldown: 2500,
    type: 'JSON Club'
}