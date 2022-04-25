module.exports = {
    name: ['addtojson'],
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

            if (poopy.data[poopy.config.mongodatabase]['bot-data']['bot'][type].find(v => v === saidMessage)) {
                msg.channel.send('Already exists.').catch(() => { })
                return
            }

            poopy.data[poopy.config.mongodatabase]['bot-data']['bot'][type].push(saidMessage)

            msg.channel.send({
                content: '✅ Added ' + saidMessage,
                allowedMentions: {
                    parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                }
            }).catch(() => { })

            poopy.arrays.psFiles = poopy.data[poopy.config.mongodatabase]['bot-data']['bot']['psfiles']
            poopy.arrays.psPasta = poopy.data[poopy.config.mongodatabase]['bot-data']['bot']['pspasta']
            poopy.arrays.funnygifs = poopy.data[poopy.config.mongodatabase]['bot-data']['bot']['funnygif']
            poopy.arrays.poopPhrases = poopy.data[poopy.config.mongodatabase]['bot-data']['bot']['poop']
            poopy.arrays.dmPhrases = poopy.data[poopy.config.mongodatabase]['bot-data']['bot']['dmphrases']
        };
    },
    help: {
        name: 'addtojson <json (psfiles, pspasta, funnygif, poop, dmphrases)> <value>',
        value: "Adds a new value to JSONs like Phexonia Studio's files."
    },
    cooldown: 2500,
    type: 'JSON Club'
}