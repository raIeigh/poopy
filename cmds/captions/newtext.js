module.exports = {
    name: ['newtext', 'newcaption'],
    args: [{ "name": "font", "required": true, "specifarg": false, "orig": "<font>", "autocomplete": require('fs').readdirSync('assets/fonts') }, { "name": "text", "required": false, "specifarg": false, "orig": "\"{text}\"" }, { "name": "maxwidth", "required": false, "specifarg": true, "orig": "[-maxwidth <pixels>]" }, { "name": "color", "required": false, "specifarg": true, "orig": "[-(color/bgcolor) <r> <g> <b> <a>]" }, { "name": "bgcolor", "required": false, "specifarg": true, "orig": "[-(color/bgcolor) <r> <g> <b> <a>]" }, { "name": "resetcolor", "required": false, "specifarg": true, "orig": "[-resetcolor]" }, { "name": "padding", "required": false, "specifarg": true, "orig": "[-padding <top> <bottom> <left> <right>]" }, {
        "name": "origin", "required": false, "specifarg": true, "orig": "[-origin <x (left/center/right)> <y (top/middle/bottom)>]", "autocomplete": [
            'left top',
            'center top',
            'right top',
            'left middle',
            'center middle',
            'right middle',
            'left bottom',
            'center bottom',
            'right bottom',
        ]
    }],
    execute: async function (msg, args) {
        let poopy = this
        let { fs, Jimp, Discord } = poopy.modules
        let vars = poopy.vars
        let config = poopy.config
        let { execPromise, sendFile } = poopy.functions

        await msg.channel.sendTyping().catch(() => { })
        var fonts = fs.readdirSync('assets/fonts')
        if (!args[1]) {
            await msg.reply(`No font specified. A valid list of fonts is ${fonts.join(', ')}`).catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        }

        var font
        if (fonts.find(font => font.toLowerCase() === args[1].toLowerCase())) {
            font = fonts.find(font => font.toLowerCase() === args[1].toLowerCase())
        } else {
            await msg.reply(`Not a supported font. A valid list of fonts are:\n${fonts.map(font => `\`${font}\``).join(', ')}`).catch(() => { })
            return
        }

        var maxwidth
        var maxwidthindex = args.indexOf('-maxwidth')
        if (maxwidthindex > -1) {
            maxwidth = isNaN(Number(args[maxwidthindex + 1])) ? undefined : Number(args[maxwidthindex + 1]) <= 1 ? 1 : Number(args[maxwidthindex + 1]) >= 2000 ? 2000 : Math.round(Number(args[maxwidthindex + 1])) || undefined
        }

        var rgb = {
            r: 255,
            g: 255,
            b: 255
        }
        var colorindex = args.indexOf('-color')
        if (colorindex > -1) {
            var r = args[colorindex + 1]
            var g = args[colorindex + 2]
            var b = args[colorindex + 3]
            rgb.r = isNaN(Number(String(r).replace(/,/g, ''))) ? 0 : Number(String(r).replace(/,/g, '')) <= 0 ? 0 : Number(String(r).replace(/,/g, '')) >= 255 ? 255 : Number(String(r).replace(/,/g, '')) || 0
            rgb.g = isNaN(Number(String(g).replace(/,/g, ''))) ? 0 : Number(String(g).replace(/,/g, '')) <= 0 ? 0 : Number(String(g).replace(/,/g, '')) >= 255 ? 255 : Number(String(g).replace(/,/g, '')) || 0
            rgb.b = isNaN(Number(String(b).replace(/,/g, ''))) ? 0 : Number(String(b).replace(/,/g, '')) <= 0 ? 0 : Number(String(b).replace(/,/g, '')) >= 255 ? 255 : Number(String(b).replace(/,/g, '')) || 0
        }

        var rgba = {
            r: 0,
            g: 0,
            b: 0,
            a: 0
        }
        var bgcolorindex = args.indexOf('-bgcolor')
        if (bgcolorindex > -1) {
            var r = args[bgcolorindex + 1]
            var g = args[bgcolorindex + 2]
            var b = args[bgcolorindex + 3]
            var a = args[bgcolorindex + 4]
            rgba.r = isNaN(Number(String(r).replace(/,/g, ''))) ? 0 : Number(String(r).replace(/,/g, '')) <= 0 ? 0 : Number(String(r).replace(/,/g, '')) >= 255 ? 255 : Number(String(r).replace(/,/g, '')) || 0
            rgba.g = isNaN(Number(String(g).replace(/,/g, ''))) ? 0 : Number(String(g).replace(/,/g, '')) <= 0 ? 0 : Number(String(g).replace(/,/g, '')) >= 255 ? 255 : Number(String(g).replace(/,/g, '')) || 0
            rgba.b = isNaN(Number(String(b).replace(/,/g, ''))) ? 0 : Number(String(b).replace(/,/g, '')) <= 0 ? 0 : Number(String(b).replace(/,/g, '')) >= 255 ? 255 : Number(String(b).replace(/,/g, '')) || 0
            rgba.a = isNaN(Number(String(a).replace(/,/g, ''))) ? 0 : Number(String(a).replace(/,/g, '')) <= 0 ? 0 : Number(String(a).replace(/,/g, '')) >= 255 ? 255 : Number(String(a).replace(/,/g, '')) || 0
        }

        var padding = {
            top: 0,
            bottom: 0,
            left: 0,
            right: 0
        }
        var paddingindex = args.indexOf('-padding')
        if (paddingindex > -1) {
            var top = args[paddingindex + 1]
            var bottom = args[paddingindex + 2]
            var left = args[paddingindex + 3]
            var right = args[paddingindex + 4]
            padding.top = isNaN(Number(String(top).replace(/,/g, ''))) ? 0 : Number(String(top).replace(/,/g, '')) <= 0 ? 0 : Number(String(top).replace(/,/g, '')) >= 2000 ? 2000 : Number(String(top).replace(/,/g, '')) || 0
            padding.bottom = isNaN(Number(String(bottom).replace(/,/g, ''))) ? 0 : Number(String(bottom).replace(/,/g, '')) <= 0 ? 0 : Number(String(bottom).replace(/,/g, '')) >= 2000 ? 2000 : Number(String(bottom).replace(/,/g, '')) || 0
            padding.left = isNaN(Number(String(left).replace(/,/g, ''))) ? 0 : Number(String(left).replace(/,/g, '')) <= 0 ? 0 : Number(String(left).replace(/,/g, '')) >= 2000 ? 2000 : Number(String(left).replace(/,/g, '')) || 0
            padding.right = isNaN(Number(String(right).replace(/,/g, ''))) ? 0 : Number(String(right).replace(/,/g, '')) <= 0 ? 0 : Number(String(right).replace(/,/g, '')) >= 2000 ? 2000 : Number(String(right).replace(/,/g, '')) || 0
        }

        var origins = {
            x: {
                left: Jimp.HORIZONTAL_ALIGN_LEFT,
                center: Jimp.HORIZONTAL_ALIGN_CENTER,
                right: Jimp.HORIZONTAL_ALIGN_RIGHT
            },

            y: {
                top: Jimp.VERTICAL_ALIGN_TOP,
                middle: Jimp.VERTICAL_ALIGN_MIDDLE,
                bottom: Jimp.VERTICAL_ALIGN_BOTTOM
            },
        }
        var originx = Jimp.HORIZONTAL_ALIGN_CENTER
        var originy = Jimp.VERTICAL_ALIGN_MIDDLE
        var originindex = args.indexOf('-origin')
        if (originindex > -1) {
            originx = origins.x[args[originindex + 1]] || Jimp.HORIZONTAL_ALIGN_CENTER
            originy = origins.y[args[originindex + 2]] || Jimp.VERTICAL_ALIGN_MIDDLE
        }

        var saidMessage = args.slice(1).join(' ').replace(/’/g, '\'')
        vars.symbolreplacements.forEach(symbolReplacement => {
            symbolReplacement.target.forEach(target => {
                saidMessage = saidMessage.replace(new RegExp(target, 'ig'), symbolReplacement.replacement)
            })
        })
        var matchedTextes = saidMessage.match(/"([\s\S]*?)"/g)
        if (!matchedTextes) {
            matchedTextes = ['""']
        }
        var text = matchedTextes[0].substring(1, matchedTextes[0].length - 1)

        var currentcount = vars.filecount
        vars.filecount++
        var filepath = `temp/${config.mongodatabase}/file${currentcount}`
        fs.mkdirSync(`${filepath}`)

        var transparent = await Jimp.read('assets/transparent.png')
        var loadedfont = await Jimp.loadFont(`assets/fonts/${font}/${font}.fnt`)
        var defaultheight = loadedfont.common.lineHeight
        var textwidth = maxwidth || Jimp.measureText(loadedfont, text)
        var textheight = Jimp.measureTextHeight(loadedfont, text, maxwidth || textwidth)
        var width = textwidth + padding.left + padding.right
        var height = textheight + padding.top + padding.bottom
        transparent.resize(width, height)
        await transparent.print(loadedfont, padding.left, padding.top, { text: Discord.Util.cleanContent(text, msg), alignmentX: originx, alignmentY: originy }, textwidth, textheight)
        if (args.find(arg => arg === '-resetcolor')) {
            transparent.color([
                {
                    apply: 'red',
                    params: [255]
                },
                {
                    apply: 'green',
                    params: [255]
                },
                {
                    apply: 'blue',
                    params: [255]
                }
            ])
        }
        transparent.color([
            {
                apply: 'red',
                params: [-255 + rgb.r]
            },
            {
                apply: 'green',
                params: [-255 + rgb.g]
            },
            {
                apply: 'blue',
                params: [-255 + rgb.b]
            }
        ])
        await transparent.writeAsync(`${filepath}/caption.png`)

        await execPromise(`ffmpeg -i ${filepath}/caption.png -f lavfi -i "color=0x${rgba.r.toString(16).padStart(2, '0')}${rgba.g.toString(16).padStart(2, '0')}${rgba.b.toString(16).padStart(2, '0')}${rgba.a.toString(16).padStart(2, '0')}:s=${width}x${height},format=rgba" -filter_complex "[1:v][0:v]overlay=x=0:y=0:format=auto[out]" -map "[out]" ${filepath}/output.png`)
        return await sendFile(msg, filepath, `output.png`, {
            content: `Font Height: **${defaultheight} pixels**`
        })
    },
    help: {
        name: 'newtext/newcaption <font> "{text}" [-maxwidth <pixels>] [-(color/bgcolor) <r> <g> <b> <a>] [-resetcolor] [-padding <top> <bottom> <left> <right>] [-origin <x (left/center/right)> <y (top/middle/bottom)>]',
        value: 'Creates a new caption from the specified options and colors.\n' +
            'Pro Tip: Using "<Img={url}>" allows you to use custom emojis in your captions!'
    },
    cooldown: 2500,
    type: 'Captions'
}