module.exports = {
    name: ['ps', 'phexoniastudios'],
    execute: async function (msg, args) {
        let poopy = this

        var type = 'any'
        var typeindex = args.indexOf('-type')
        if (typeindex > -1) {
            type = String(args[typeindex + 1]).toLowerCase()
        }

        if (type === 'image') {
            var psImages = []

            for (var i in poopy.arrays.psFiles) {
                var file = poopy.arrays.psFiles[i]
                if (!(file.match(/\.(gif|mov|mp4|apng)/))) psImages.push(file)
            }

            await msg.channel.send(psImages[Math.floor(Math.random() * psImages.length)]).catch(() => { })
        } else if (type === 'video') {
            var psVideos = []

            for (var i in poopy.arrays.psFiles) {
                var file = poopy.arrays.psFiles[i]
                if (file.match(/\.(mov|mp4)/)) psVideos.push(file)
            }

            await msg.channel.send(psVideos[Math.floor(Math.random() * psVideos.length)]).catch(() => { })
        } else if (type === 'gif') {
            var psGifs = []

            for (var i in poopy.arrays.psFiles) {
                var file = poopy.arrays.psFiles[i]
                if (file.match(/\.(gif|apng)/)) psGifs.push(file)
            }

            await msg.channel.send(psGifs[Math.floor(Math.random() * psGifs.length)]).catch(() => { })
        } else {
            await msg.channel.send(poopy.arrays.psFiles[Math.floor(Math.random() * poopy.arrays.psFiles.length)]).catch(() => { })
        }
    },
    help: {
        name: 'ps/phexoniastudios [-type <extension (image/video/gif)>]',
        value: 'Sends a random Phexonia Studios related image, GIF or video to the channel.'
    },
    cooldown: 2500,
    type: 'Inside Joke'
}