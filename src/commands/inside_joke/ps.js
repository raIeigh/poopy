module.exports = {
    name: ['ps', 'phexoniastudios'],
    args: [{
        "name": "type", "required": false, "specifarg": true, "orig": "[-type <extension (image/video/gif)>]", "autocomplete": [
            'image',
            'video',
            'gif'
        ]
    }],
    execute: async function (msg, args) {
        let poopy = this
        let arrays = poopy.arrays

        var type = 'any'
        var typeindex = args.indexOf('-type')
        if (typeindex > -1) {
            type = String(args[typeindex + 1]).toLowerCase()
        }

        var psFiles = arrays.psFiles.filter(file => {
            switch (type) {
                case 'image': return file.match(/\.(gif|mov|mp4)/)

                case 'video': return file.match(/\.(mov|mp4)/)

                case 'gif': return file.match(/\.(gif|apng)/)

                default: return true
            }
        })

        var psFile = psFiles[Math.floor(Math.random() * psFiles.length)]
        if (!msg.nosend) await msg.reply(psFile).catch(() => { })
        return psFile
    },
    help: {
        name: 'ps/phexoniastudios [-type <extension (image/video/gif)>]',
        value: 'Sends a random Phexonia Studios related image, GIF or video to the channel.'
    },
    cooldown: 2500,
    type: 'Inside Joke'
}