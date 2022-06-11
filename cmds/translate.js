module.exports = {
    name: ['translate', 'tr'],
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

        var saidMessage = args.slice(1).join(' ')

        var options = {
            method: 'POST',
            url: 'https://microsoft-translator-text.p.rapidapi.com/translate',
            params: { from: source, to: target, 'api-version': '3.0', profanityAction: 'NoAction', textType: 'plain' },
            headers: {
                'content-type': 'application/json',
                'x-rapidapi-host': 'microsoft-translator-text.p.rapidapi.com',
                'x-rapidapi-key': poopy.functions.randomKey('RAPIDAPIKEY')
            },
            data: [{ Text: saidMessage }]
        };

        var response = await poopy.modules.axios.request(options).catch(async () => {
            await msg.channel.send('Error.').catch(() => { })
        })

        await msg.channel.send({
            content: response.data[0].translations[0].text,
            allowedMentions: {
                parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
            }
        }).catch(() => { })
        await msg.channel.sendTyping().catch(() => { })
    },
    help: {
        name: 'translate/tr <message> [-source <language>] [-target <language>]',
        value: 'Translates the specified message. The default source language is auto and the default target language is English.'
    },
    type: 'Text'
}