module.exports = {
    name: ['outsidejoke', 'ojl'],
    args: [{
        name: "type", required: false, specifarg: true, orig: "[-type <extension (image/video/gif)>]", autocomplete: [
            'image',
            'video',
            'gif'
        ]
    }, {
        name: "group", required: false, specifarg: true, orig: "[-group <community name>]", autocomplete: async function (interaction) {
            let poopy = this
            let arrays = poopy.arrays
            let globaldata = poopy.globaldata

            var outsideJokeFolder = arrays.outsideMedia

            return outsideJokeFolder.map(groupInfo => { return { name: groupInfo.fullname, value: groupInfo.name } })
        }
    }],
    execute: async function (msg, args) {
        let poopy = this
        let arrays = poopy.arrays
        let config = poopy.config
        let globaldata = poopy.globaldata

        var type = 'any'
        var typeindex = args.indexOf('-type')
        if (typeindex > -1) {
            type = String(args[typeindex + 1]).toLowerCase()
        }

        var group = undefined
        var groupindex = args.indexOf('-group')
        if (groupindex > -1) {
            group = String(args[typeindex + 1]).toLowerCase()
        }

        var outsideJokeFolder = arrays.outsideMedia
        
        var groupInfo = group && outsideJokeFolder.find(g => g.name == group)
        if (group && !groupInfo) {
            await msg.reply(`\`${group}\` is not a valid group! (Available: ${outsideJokeFolder.map(g => `**${g.name}**`).join(', ')})`)
            return;
        }

        var mediaArray = groupInfo === undefined
            ? outsideJokeFolder.reduce((arr, groupInfo) => arr.concat(groupInfo.list), [])
            : groupInfo.list

        var outsideMedia = mediaArray.filter(file => {
            switch (type) {
                case 'image': return file.match(/\.(png|jpe?g|bmp|webp|tiff)/)

                case 'video': return file.match(/\.(mov|mp4|wmv|avi|webm)/)

                case 'gif': return file.match(/\.(gif|apng)/)

                default: return true
            }
        })

        var shit = outsideMedia[Math.floor(Math.random() * outsideMedia.length)]
        if (!msg.nosend) await msg.reply(shit).catch(() => { })
        return shit
    },
    help: {
        name: 'outsidejoke/ojl [-type <extension (image/video/gif)>] [-group <community name>]',
        value: 'Returns a random inside joke media from a community outside of Poopy.'
    },
    cooldown: 2500,
    type: 'Inside Joke',
    envRequired: ['FAT_PLUMBER_MARIO']
}
