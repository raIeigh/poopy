module.exports = {
    name: ['badtranslate', 'badtr'],
    args: [{"name":"message","required":true,"specifarg":false},{"name":"source","required":false,"specifarg":true},{"name":"target","required":false,"specifarg":true},{"name":"languages","required":false,"specifarg":true}],
    execute: async function (msg, args) {
        let poopy = this

        await msg.channel.sendTyping().catch(() => { })
        if (args[1] === undefined) {
            await msg.channel.send('What is the text to translate?!').catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        }
        var lresponse = await poopy.modules.axios.request({
            method: 'GET',
            url: 'https://microsoft-translator-text.p.rapidapi.com/languages',
            params: { 'api-version': '3.0' },
            headers: {
                'x-rapidapi-host': 'microsoft-translator-text.p.rapidapi.com',
                'x-rapidapi-key': poopy.functions.randomKey('RAPIDAPIKEY')
            }
        }).catch(() => { })
        var languages = []
        for (var i in lresponse.data.translation) {
            lresponse.data.translation[i].language = i
            languages.push(lresponse.data.translation[i])
        }

        var source = null
        var sourceindex = args.indexOf('-source')
        if (sourceindex > -1) {
            if (languages.find(language => (language.language === args[sourceindex + 1].toLowerCase()) || (language.name === args[sourceindex + 1].toLowerCase()))) {
                source = languages.find(language => (language.language === args[sourceindex + 1].toLowerCase()) || (language.name === args[sourceindex + 1].toLowerCase())).language
            } else {
                await msg.channel.send(`Not a supported source language. A list of supported languages are:\n${languages.map(language => `${language.name} (${language.language})`).join(', ')}`).catch(() => { })
                return
            }
            args.splice(sourceindex, 2)
        }

        var target = 'en'
        var targetindex = args.indexOf('-target')
        if (targetindex > -1) {
            if (languages.find(language => (language.language === args[targetindex + 1].toLowerCase()) || (language.name === args[targetindex + 1].toLowerCase()))) {
                target = languages.find(language => (language.language === args[targetindex + 1].toLowerCase()) || (language.name === args[targetindex + 1].toLowerCase())).language
            } else {
                await msg.channel.send(`Not a supported target language. A list of supported languages are:\n${languages.map(language => `${language.name} (\`${language.language}\`)`).join(', ')}`).catch(() => { })
                return
            }
            args.splice(targetindex, 2)
        }

        var repeat = 5
        var languagesindex = args.indexOf('-languages')
        if (languagesindex > -1) {
            repeat = isNaN(Number(args[languagesindex + 1])) ? 5 : Number(args[languagesindex + 1]) <= 2 ? 2 : Number(args[languagesindex + 1]) >= 25 ? 25 : Math.round(Number(args[languagesindex + 1])) || 5
            args.splice(languagesindex, 2)
        }
        var maxlength = Math.round(2000 / repeat)

        var saidMessage = args.slice(1).join(' ')

        if (saidMessage.length > maxlength) {
            await msg.channel.send(`The input length must be smaller or equal to 2000 divided by the number of repetitions. (in this case ${maxlength} characters)`)
            return
        }

        var output = saidMessage
        var lastlanguage = source
        var currentlanguage = languages[Math.floor(Math.random() * languages.length)].language

        var lmessage = await msg.channel.send(`Translating from ${languages.find(language => language.language === lastlanguage) ? languages.find(language => language.language === lastlanguage).name : 'Auto'} to ${languages.find(language => language.language === currentlanguage).name}. (${output})`).catch(() => { })

        for (var i = 0; i < repeat; i++) {
            var options = {
                method: 'POST',
                url: 'https://microsoft-translator-text.p.rapidapi.com/translate',
                params: { from: lastlanguage, to: currentlanguage, 'api-version': '3.0', profanityAction: 'NoAction', textType: 'plain' },
                headers: {
                    'content-type': 'application/json',
                    'x-rapidapi-host': 'microsoft-translator-text.p.rapidapi.com',
                    'x-rapidapi-key': poopy.functions.randomKey('RAPIDAPIKEY')
                },
                data: [{ Text: output }]
            };

            var response = await poopy.modules.axios.request(options).catch(async () => {
                await msg.channel.send('Error.').catch(() => { })
            })

            if (!response) {
                return
            }

            output = response.data[0].translations[0].text
            lastlanguage = currentlanguage
            currentlanguage = i == repeat - 2 ? target : languages[Math.floor(Math.random() * languages.length)].language
            if (lmessage && i != repeat - 1) {
                await lmessage.edit(`Translating from ${languages.find(language => language.language === lastlanguage) ? languages.find(language => language.language === lastlanguage).name : 'Auto'} to ${languages.find(language => language.language === currentlanguage).name}. (${output})`).catch(() => { })
            }
        }

        if (lmessage) {
            await lmessage.delete().catch(() => { })
        }

        await msg.channel.send({
            content: output,
            allowedMentions: {
                parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
            }
        }).catch(() => { })
        await msg.channel.sendTyping().catch(() => { })
    },
    help: {
        name: 'badtranslate/badtr <message> [-source <language>] [-target <language>] [-languages <number (max 25)>]',
        value: 'Badly translates the specified message. The default source language is auto and the default target language is English.'
    },
    type: 'Text',
    envRequired: ['RAPIDAPIKEY']
}