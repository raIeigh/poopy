module.exports = {
    name: ['displayjson'],
    execute: async function (msg, args) {
        let poopy = this

        var jsonid = poopy.config.ownerids.find(id => id == msg.author.id) || poopy.config.jsoning.find(id => id == msg.author.id);
        if (jsonid === undefined) {
            msg.channel.send('json club only').catch(() => { })
            return
        } else {
            var types = ['psfiles', 'pspasta', 'funnygif', 'poop', 'dmphrases']

            if (args[1] === undefined) {
                msg.channel.send(`What is the JSON to display?! (Available: ${types.map(t => `**${t}**`).join(', ')})`).catch(() => { })
                return;
            }

            var type

            if (types.find(t => t === args[1].toLowerCase())) {
                type = args[1].toLowerCase()
            } else {
                msg.channel.send('Not a JSON type.').catch(() => { })
                return
            }

            var currentcount = poopy.vars.filecount
            poopy.vars.filecount++
            var filepath = `temp/${poopy.config.mongodatabase}/file${currentcount}`
            poopy.modules.fs.mkdirSync(filepath)
            poopy.modules.fs.writeFileSync(`${filepath}/jsonlist.txt`, poopy.data[poopy.config.mongodatabase]['bot-data']['bot'][type].join('\n\n-----------------------------------------------\n\n') || 'lmao theres nothing')
            await msg.channel.send({
                files: [new poopy.modules.Discord.MessageAttachment(`${filepath}/jsonlist.txt`)]
            }).catch(() => { })
            poopy.modules.fs.rmSync(`${filepath}`, { force: true, recursive: true })
        };
    },
    help: {
        name: 'displayjson <json (psfiles, pspasta, funnygif, poop, dmphrases)>',
        value: "Displays the values of a JSON like Phexonia Studio's files."
    },
    cooldown: 2500,
    type: 'JSON Club'
}