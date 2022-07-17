module.exports = {
    name: ['addtojson'],
    execute: async function (msg, args) {
        let poopy = this

        var jsonid = poopy.config.ownerids.find(id => id == msg.author.id) || poopy.config.jsoning.find(id => id == msg.author.id);
        if (jsonid === undefined) {
            await msg.channel.send('json club only').catch(() => { })
            return
        } else {
            var types = ['psfiles', 'pspasta', 'funnygif', 'poop', 'dmphrases']

            if (args[1] === undefined) {
                await msg.channel.send(`What is the JSON to update?! (Available: ${types.map(t => `**${t}**`).join(', ')})`).catch(() => { })
                return;
            } else if (args[2] === undefined) {
                await msg.channel.send('What is the value?!').catch(() => { })
                return;
            }

            var type

            if (types.find(t => t === args[1].toLowerCase())) {
                type = args[1].toLowerCase()
            } else {
                await msg.channel.send('Not a JSON type.').catch(() => { })
                return
            }
            var saidMessage = args.slice(2).join(' ')

            if (poopy.functions.globalData()['bot-data'][type].find(v => v === saidMessage)) {
                await msg.channel.send('Already exists.').catch(() => { })
                return
            }

            poopy.functions.globalData()['bot-data'][type].push(saidMessage)

            await msg.channel.send({
                content: '✅ Added ' + saidMessage,
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
        name: 'addtojson <json (psfiles, pspasta, funnygif, poop, dmphrases)> <value>',
        value: "Adds a new value to JSONs like Phexonia Studio's files."
    },
    cooldown: 2500,
    type: 'JSON Club'
}