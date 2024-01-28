module.exports = {
    name: ['shit'],
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

        var shitting = arrays.shitting.filter(file => {
            switch (type) {
                case 'image': return file.match(/\.(png|jpe?g|bmp|tiff)/)

                case 'video': return file.match(/\.(mov|mp4|wmv|avi)/)

                case 'gif': return file.match(/\.(gif|apng)/)

                default: return true
            }
        })

        var shit = shitting[Math.floor(Math.random() * shitting.length)]
        if (!msg.nosend) await msg.reply(shit).catch(() => { })
        return shit
    },
    help: {
        name: 'shit [-type <extension (image/video/gif)>]',
        value: 'shit'
    },
    cooldown: 2500,
    type: 'Inside Joke'
}