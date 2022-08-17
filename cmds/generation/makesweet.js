module.exports = {
    name: ['makesweet', 'heartlocket'],
    args: [{"name":"text1}\".","required":false,"specifarg":false},{"name":"file1}..","required":false,"specifarg":false},{"name":"textfirst","required":false,"specifarg":true},{"name":"template","required":false,"specifarg":true}],
    execute: async function (msg, args) {
        let poopy = this

        await msg.channel.sendTyping().catch(() => { })

        var templates = {
            'billboard-cityscape': 1,
            'circuit-board': 1,
            'flag': 1,
            'flying-bear': 1,
            'heart-locket': 2,
            'nesting-doll': 3
        }
        var template = `heart-locket`
        var templateindex = args.indexOf('-template')
        if (templateindex > -1) {
            if (templates[args[templateindex + 1].toLowerCase()]) {
                template = args[templateindex + 1].toLowerCase()
            } else {
                await msg.channel.send('Not a supported template.').catch(() => { })
                return
            }
        }

        var textfirst = args.includes('-textfirst')

        var saidMessage = args.slice(1).join(' ').replace(/’/g, '\'')
        poopy.vars.symbolreplacements.forEach(symbolReplacement => {
            symbolReplacement.target.forEach(target => {
                saidMessage = saidMessage.replace(new RegExp(target, 'ig'), symbolReplacement.replacement)
            })
        })

        var textes = (saidMessage.match(/"([\s\S]*?)"/g) ?? []).slice(0, templates[template]).map(t => t.substring(1, t.length - 1))
        var files = []

        var fetched = await poopy.functions.getUrls(msg, { max: templates[template] - textes.length }).catch(() => { }) ?? []

        if (textes.length <= 0 && fetched.length <= 0) {
            await msg.channel.send('What are the arguments?!').catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        };

        var filepath

        for (var i in fetched) {
            var url = fetched[i]

            var fileinfo = await poopy.functions.validateFile(url).catch(async error => {
                await msg.channel.send(error).catch(() => { })
                await msg.channel.sendTyping().catch(() => { })
                return
            })

            if (!fileinfo) return

            var filetype = fileinfo.type
            if (!filetype || !(filetype.mime.startsWith('image') && !(poopy.vars.gifFormats.find(f => f === filetype.ext)))) {
                await msg.channel.send({
                    content: `Unsupported file: \`${url}\``,
                    allowedMentions: {
                        parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                    }
                }).catch(() => { })
                return
            }
        }

        var currentcount = poopy.vars.filecount
        poopy.vars.filecount++
        var filepath = `temp/${poopy.config.mongodatabase}/file${currentcount}`

        poopy.modules.fs.mkdirSync(`${filepath}`)

        for (var i in fetched) {
            var url = fetched[i]

            await poopy.functions.downloadFile(url, `input${files.length}.${fileinfo.shortext}`, {
                fileinfo: fileinfo,
                filepath: filepath
            })
            var filename = `input${files.length}.${fileinfo.shortext}`
            files.push(filename)
        }

        var form = new poopy.modules.FormData()

        files.forEach(filename => form.append('images', poopy.modules.fs.readFileSync(`${filepath}/${filename}`), filename))

        var response = await poopy.modules.axios.request({
            url: `http://api.makesweet.com/make/${template}${textes.length > 0 ? `?${textes.map(text => `text=${encodeURIComponent(text)}`).join('&')}${textfirst && templates[template] > 1 ? `&textfirst=1` : ''}` : ''}`,
            method: 'POST',
            data: form,
            headers: {
                ...form.getHeaders(),
                Authorization: process.env.MAKESWEETKEY
            },
            responseType: 'arraybuffer'
        }).catch(async (e) => {
            await msg.channel.send(e.response.statusText).catch(() => { })
            poopy.modules.fs.rmSync(`${filepath}`, { force: true, recursive: true })
        })

        if (!response) return

        await poopy.functions.downloadFile(response.data, `output.gif`, {
            buffer: true,
            filepath: filepath
        })
        return await poopy.functions.sendFile(msg, filepath, `output.gif`)
    },
    help: {
        name: 'makesweet/heartlocket "{text1}"... {file1}... [-textfirst] [-template <name>]',
        value: "Creates a MakeSweet GIF depending on the template, if specified. Available templates are billboard-cityscape, circuit-board, flag, flying-bear, heart-locket and nesting-doll. Try it yourself at https://makesweet.com/"
    },
    cooldown: 2500,
    type: 'Generation',
    envRequired: ['MAKESWEETKEY']
}