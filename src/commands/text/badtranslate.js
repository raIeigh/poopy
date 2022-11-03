module.exports = {
    name: ['badtranslate', 'badtr'],
    args: [{ "name": "message", "required": true, "specifarg": false, "orig": "<message>" }, {
        "name": "source", "required": false, "specifarg": true, "orig": "[-source <language>]",
        "autocomplete": function () {
            let poopy = this
            return poopy.vars.languages.map(lang => {
                return { name: lang.name, value: lang.language }
            })
        }
    }, {
        "name": "target", "required": false, "specifarg": true, "orig": "[-target <language>]",
        "autocomplete": function () {
            let poopy = this
            return poopy.vars.languages.map(lang => {
                return { name: lang.name, value: lang.language }
            })
        }
    }, { "name": "languages", "required": false, "specifarg": true, "orig": "[-languages <number (max 25)>]" },
    { "name": "details", "required": false, "specifarg": true, "orig": "[-details]" }],
    execute: async function (msg, args) {
        let poopy = this
        let vars = poopy.vars
        let { getOption, userToken } = poopy.functions
        let { axios } = poopy.modules

        await msg.channel.sendTyping().catch(() => { })
        var details = getOption(args, 'details', { n: 0, splice: true, dft: false })
        if (args[1] === undefined) {
            await msg.reply('What is the text to translate?!').catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        }

        var source = null
        var sourceindex = args.indexOf('-source')
        if (sourceindex > -1) {
            if (vars.languages.find(language => (language.language === args[sourceindex + 1].toLowerCase()) || (language.name === args[sourceindex + 1].toLowerCase()))) {
                source = vars.languages.find(language => (language.language === args[sourceindex + 1].toLowerCase()) || (language.name === args[sourceindex + 1].toLowerCase())).language
            } else {
                await msg.reply(`Not a supported source language. A list of supported languages are:\n${vars.languages.map(language => `\`${language.language}\``).join(', ')}`).catch(() => { })
                return
            }
            args.splice(sourceindex, 2)
        }

        var target = 'en'
        var targetindex = args.indexOf('-target')
        if (targetindex > -1) {
            if (vars.languages.find(language => (language.language === args[targetindex + 1].toLowerCase()) || (language.name === args[targetindex + 1].toLowerCase()))) {
                target = vars.languages.find(language => (language.language === args[targetindex + 1].toLowerCase()) || (language.name === args[targetindex + 1].toLowerCase())).language
            } else {
                await msg.reply(`Not a supported target language. A list of supported languages are:\n${vars.languages.map(language => `\`${language.language}\``).join(', ')}`).catch(() => { })
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
            await msg.reply(`The input length must be smaller or equal to 2000 divided by the number of repetitions. (in this case ${maxlength} characters)`)
            return
        }

        var output = saidMessage
        var lastlanguage = source
        var currentlanguage = vars.languages[Math.floor(Math.random() * vars.languages.length)].language

        var lmessage = !msg.nosend && details && await msg.reply(`Translating from ${vars.languages.find(language => language.language === lastlanguage) ? vars.languages.find(language => language.language === lastlanguage).name : 'Auto'} to ${vars.languages.find(language => language.language === currentlanguage).name}. (${output})`).catch(() => { })

        for (var i = 0; i < repeat; i++) {
            var options = {
                method: 'POST',
                url: 'https://microsoft-translator-text.p.rapidapi.com/translate',
                params: { from: lastlanguage, to: currentlanguage, 'api-version': '3.0', profanityAction: 'NoAction', textType: 'plain' },
                headers: {
                    'content-type': 'application/json',
                    'x-rapidapi-host': 'microsoft-translator-text.p.rapidapi.com',
                    'x-rapidapi-key': userToken(msg.author.id, 'RAPIDAPI_KEY')
                },
                data: [{ Text: output }]
            };

            var response = await axios.request(options).catch(async () => {
                await msg.reply('Error.').catch(() => { })
            })

            if (!response) {
                return
            }

            output = response.data[0].translations[0].text
            lastlanguage = currentlanguage
            currentlanguage = i == repeat - 2 ? target : vars.languages[Math.floor(Math.random() * vars.languages.length)].language
            if (lmessage && i != repeat - 1 && !msg.nosend) {
                await lmessage.edit(`Translating from ${vars.languages.find(language => language.language === lastlanguage) ? vars.languages.find(language => language.language === lastlanguage).name : 'Auto'} to ${vars.languages.find(language => language.language === currentlanguage).name}. (${output})`).catch(() => { })
            }
        }

        if (lmessage) {
            await lmessage.delete().catch(() => { })
        }

        if (!msg.nosend) await msg.reply({
            content: output,
            allowedMentions: {
                parse: ((!msg.member.permissions.has('Administrator') && !msg.member.permissions.has('MentionEveryone') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
            }
        }).catch(() => { })
        return output
    },
    help: {
        name: 'badtranslate/badtr <message> [-source <language>] [-target <language>] [-languages <number (max 25)>] [-details]',
        value: 'Badly translates the specified message. The default source language is auto and the default target language is English.'
    },
    type: 'Text',
    envRequired: ['RAPIDAPI_KEY']
}