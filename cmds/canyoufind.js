module.exports = {
    name: ['canyoufind', 'find'],
    execute: async function (msg, args) {
        let poopy = this

        msg.channel.sendTyping().catch(() => { })
        if (poopy.data['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrl2'] === undefined && args[2] === undefined) {
            msg.channel.send('What are the files?!').catch(() => { })
            msg.channel.sendTyping().catch(() => { })
            return;
        };
        var size = 150
        var sizeindex = args.indexOf('-size')
        if (sizeindex > -1) {
            size = isNaN(Number(args[sizeindex + 1])) ? 1 : Number(args[sizeindex + 1]) <= 1 ? 1 : Number(args[sizeindex + 1]) || 1
        }
        var currenturl = poopy.data['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrl'] || args[1]
        var currenturl2 = poopy.data['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrl2'] || args[2]
        var urls = await poopy.functions.getUrls(msg).catch(() => { }) ?? []
        if (urls.length < 2) {
            var c = currenturl
            currenturl = currenturl2
            currenturl2 = c
        }
        var errors = {}
        var fileinfo = await poopy.functions.validateFile(currenturl, false, {
            size: `the first file exceeds the size limit of {param} mb hahahaha (try to use the shrink, setfps, trim or crunch commands)`,
            frames: `the frames of the first file exceed the limit of {param} hahahaha (try to use the setfps or the trim commands)`,
            width: `the width of the first file exceeds the limit of {param} hahahaha (try to use the shrink command)`,
            height: `the height of the first file exceeds the limit of {param} hahahaha (try to use the shrink command)`
        }).catch(error => {
            msg.channel.send(error)
            msg.channel.sendTyping().catch(() => { })
            return;
        })
        if (!fileinfo) return
        var filetype = fileinfo.type
        var fileinfo2 = await poopy.functions.validateFile(currenturl2, false, {
            size: `the second file exceeds the size limit of {param} mb hahahaha (try to use the shrink, setfps, trim or crunch commands)`,
            frames: `the frames of the second file exceed the limit of {param} hahahaha (try to use the setfps or the trim commands)`,
            width: `the width of the second file exceeds the limit of {param} hahahaha (try to use the shrink command)`,
            height: `the height of the second file exceeds the limit of {param} hahahaha (try to use the shrink command)`
        }).catch(error => {
            msg.channel.send(error)
            msg.channel.sendTyping().catch(() => { })
            return;
        })
        if (!fileinfo2) return
        var filetype2 = fileinfo2.type
        var filetypes = [filetype, filetype2]
        for (var i in errors) {
            var error = errors[i]
            if (error) {
                msg.channel.send({
                    content: error,
                    allowedMentions: {
                        parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                    }
                }).catch(() => { })
                msg.channel.sendTyping().catch(() => { })
                return
            }
        }
        for (var i in filetypes) {
            var type = filetypes[i]
            if (!(type.mime.startsWith('image') && !(poopy.vars.gifFormats.find(f => f === type.ext)) && poopy.vars.jimpFormats.find(f => f === type.ext))) {
                msg.channel.send({
                    content: 'Unsupported file types.',
                    allowedMentions: {
                        parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                    }
                }).catch(() => { })
                msg.channel.sendTyping().catch(() => { })
                return
            }
        }
        var currentcount = poopy.vars.filecount
        poopy.vars.filecount++
        var filepath = `temp/${poopy.config.mongodatabase}/file${currentcount}`
        poopy.modules.fs.mkdirSync(`${filepath}`)
        var frame = await poopy.modules.Jimp.read(currenturl)
        var frame2 = await poopy.modules.Jimp.read(currenturl2)
        var canyoufind = await poopy.modules.Jimp.read(`templates/canyoufind.png`)
        var transparent = await poopy.modules.Jimp.read(`templates/transparent.png`)
        var squareS = { value: ((frame.bitmap.height === frame.bitmap.width) && frame.bitmap.width) || ((frame.bitmap.height > frame.bitmap.width) && frame.bitmap.height) || frame.bitmap.width, constraint: ((frame.bitmap.height === frame.bitmap.width) && 'both') || ((frame.bitmap.height > frame.bitmap.width) && 'height') || 'width' }
        frame2.resize(squareS.constraint === 'width' || squareS.constraint === 'both' ? size : poopy.modules.Jimp.AUTO, squareS.constraint === 'height' || squareS.constraint === 'both' ? size : poopy.modules.Jimp.AUTO)
        var frame2stretched = frame2.clone()
        frame2stretched.resize(227, 53)
        canyoufind.composite(frame2stretched, 347, 8)
        frame.resize(canyoufind.bitmap.width, poopy.modules.Jimp.AUTO)
        frame.composite(frame2, (Math.floor(Math.random() * (frame.bitmap.width + 1)) - 1) - frame2.bitmap.width / 2, (Math.floor(Math.random() * (frame.bitmap.height + 1)) - 1) - frame2.bitmap.height / 2)
        transparent.resize(frame.bitmap.width, frame.bitmap.height + canyoufind.bitmap.height)
        transparent.composite(canyoufind, 0, 0)
        transparent.composite(frame, 0, canyoufind.bitmap.height)
        await transparent.writeAsync(`${filepath}/output.png`);
        await poopy.functions.sendFile(msg, filepath, `output.png`)
    },
    help: {
        name: 'canyoufind/find <background> <tofind> [-size <pixels>]',
        value: 'Can you find mario (only works with static images though)\n' +
            'Example usage: p:find https://images.herzindagi.info/image/2020/Jun/chocolate-parle-g-ice-cream.jpg https://pbs.twimg.com/media/BOgwprmCEAAvjq3.jpg -size 50'
    },
    cooldown: 2500,
    type: 'Memes'
}