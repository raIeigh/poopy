module.exports = {
    name: ['displayjson'],
    args: [{
        "name": "json", "required": true, "specifarg": false, "orig": "<json (psfiles, pspasta, funnygif, poop, dmphrases, shitting)>", "autocomplete": [
            'psfiles',
            'pspasta',
            'funnygif',
            'poop',
            'dmphrases',
            'shitting'
        ]
    }],
    execute: async function (msg, args) {
        let poopy = this
        let config = poopy.config
        let vars = poopy.vars
        let { fs, Discord } = poopy.modules
        let globaldata = poopy.globaldata

        var jsonid = config.ownerids.find(id => id == msg.author.id) || config.jsoning.find(id => id == msg.author.id);
        if (jsonid === undefined) {
            await msg.reply('json club only').catch(() => { })
            return
        } else {
            var types = ['psfiles', 'pspasta', 'funnygif', 'poop', 'dmphrases', 'shitting']

            if (args[1] === undefined) {
                await msg.reply(`What is the JSON to display?! (Available: ${types.map(t => `**${t}**`).join(', ')})`).catch(() => { })
                return;
            }

            var type

            if (types.find(t => t === args[1].toLowerCase())) {
                type = args[1].toLowerCase()
            } else {
                await msg.reply('Not a JSON type.').catch(() => { })
                return
            }

            var currentcount = vars.filecount
            vars.filecount++
            var filepath = `temp/${config.database}/file${currentcount}`
            fs.mkdirSync(filepath)
            fs.writeFileSync(`${filepath}/jsonlist.txt`, globaldata[type].join('\n\n-----------------------------------------------\n\n') || 'lmao theres nothing')
            if (!msg.nosend) await msg.reply({
                files: [new Discord.AttachmentBuilder(`${filepath}/jsonlist.txt`)]
            }).catch(() => { })
            fs.rmSync(`${filepath}`, { force: true, recursive: true })

            return globaldata[type].join('\n\n-----------------------------------------------\n\n') || 'lmao theres nothing'
        };
    },
    help: {
        name: 'displayjson <json (psfiles, pspasta, funnygif, poop, dmphrases, shitting)>',
        value: "Displays the values of a JSON like Phexonia Studio's files."
    },
    cooldown: 2500,
    type: 'JSON Club'
}