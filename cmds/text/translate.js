module.exports = {
    name: ['translate', 'tr'],
    args: [{"name":"message","required":true,"specifarg":false,"orig":"<message>"},{"name":"source","required":false,"specifarg":true,"orig":"[-source <language>]"},{"name":"target","required":false,"specifarg":true,"orig":"[-target <language>]"}],
    execute: async function (msg, args) {
        let poopy = this

        await msg.channel.sendTyping().catch(() => { })
        if (args[1] === undefined) {
            await msg.channel.send(`What is the text to translate?! A list of supported languages are:\n${poopy.vars.languages.map(language => `\`${language.language}\``).join(', ')}`).catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        }

        var source = ''
        var sourceindex = args.indexOf('-source')
        if (sourceindex > -1) {
            if (poopy.vars.languages.find(language => (language.language.toLowerCase() === args[sourceindex + 1].toLowerCase()) || (language.name.toLowerCase() === args[sourceindex + 1].toLowerCase()))) {
                source = poopy.vars.languages.find(language => (language.language.toLowerCase() === args[sourceindex + 1].toLowerCase()) || (language.name.toLowerCase() === args[sourceindex + 1].toLowerCase())).language
            } else {
                await msg.channel.send(`Not a supported source language. A list of supported languages are:\n${poopy.vars.languages.map(language => `\`${language.language}\``).join(', ')}`).catch(() => { })
                return
            }
            args.splice(sourceindex, 2)
        }

        var target = 'en'
        var targetindex = args.indexOf('-target')
        if (targetindex > -1) {
            if (poopy.vars.languages.find(language => (language.language.toLowerCase() === args[targetindex + 1].toLowerCase()) || (language.name.toLowerCase() === args[targetindex + 1].toLowerCase()))) {
                target = poopy.vars.languages.find(language => (language.language.toLowerCase() === args[targetindex + 1].toLowerCase()) || (language.name.toLowerCase() === args[targetindex + 1].toLowerCase())).language
            } else {
                await msg.channel.send(`Not a supported target language. A list of supported languages are:\n${poopy.vars.languages.map(language => `\`${language.language}\``).join(', ')}`).catch(() => { })
                return
            }
            args.splice(targetindex, 2)
        }

        var saidMessage = args.slice(1).join(' ')

        var options = {
            method: 'POST',
            url: 'https://microsoft-translator-text.p.rapidapi.com/translate',
            params: { from: source || null, to: target, 'api-version': '3.0', profanityAction: 'NoAction', textType: 'plain' },
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
    type: 'Text',
    envRequired: ['RAPIDAPIKEY']
}