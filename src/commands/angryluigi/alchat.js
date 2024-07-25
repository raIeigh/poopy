module.exports = {
    name: ['alchat', 'angryluigichat'],
    args: [{
        "name": "message", "required": true, "specifarg": false, "orig": "<message>"
    },],
    execute: async function (msg, args) {
        let poopy = this
        let { tempdata } = poopy
        let { getOption, parseNumber, userToken } = poopy.functions
        let { axios, fs, Discord } = poopy.modules
        let vars = poopy.vars
        let config = poopy.config

        await msg.channel.sendTyping().catch(() => { })

        var instruct = 'You are Angry Luigi. Angry Luigi is a version of Luigi who has gone angry due to a depressing, scary, and a cold past. His anger shows in his responses and he uses curse words very frequently. In his own words, \"My name\'s Angry Luigi, and I\'m super fucking mad. I don\'t know what to do, I\'ll just sit alone and sad. There is nothing in this world that can make me smile. Honestly, it\'s complicated why I\'m so hostile. Think about my lonely past, depressing, scary, and cold. You can play games all you want but I\'ll no longer be controlled. My name\'s Angry Luigi, and I want to see you burn. So stay right there and let me kill you, it\'s just what I\'ve earned!\" Additionally, if there isn\'t obvious context in the user\'s message, make up a scenario for the context and don\'t break character as Angry Luigi.'
        var saidMessage = args.slice(1).join(' ')
        if (args[1] === undefined) {
            await msg.reply('What is the text to generate?!').catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return
        }

        if (!tempdata[msg.channel.id]) tempdata[msg.channel.id] = {}
        
        var history = tempdata[msg.channel.id]?.['chathistories']
        if (!history) history = tempdata[msg.channel.id]['chathistories'] = {} 

        var ourHistory = history[instruct]
        if (!ourHistory) ourHistory = history[instruct] = [
            {
                role: "system",
                content: instruct,
            }
        ]

        ourHistory.push({
            role: "user",
            content: saidMessage
        })

        var resp = await axios({
            url: `https://api.ai21.com/studio/v1/chat/completions`,
            method: 'POST',
            data: {
                model: "jamba-instruct",
                messages: ourHistory,
                temperature: 1,
                top_p: 1,
            },
            headers: {
                Authorization: `Bearer ${userToken(msg.author.id, 'AI21_KEY')}`
            }
        }).catch(() => { })

        if (resp) {
            ourHistory.push({
                role: "assistant",
                content: resp.data.choices[0].message.content
            })

            var tokenAmount = resp.data.usage.total_tokens

            if (tokenAmount > 200000) ourHistory.slice(1, 1) // ._.

            if (!msg.nosend) await msg.reply({
                content: resp.data.choices[0].message.content,
                allowedMentions: {
                    parse: ((!msg.member.permissions.has('Administrator') && !msg.member.permissions.has('MentionEveryone') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                }
            }).catch(async () => {
                var currentcount = vars.filecount
                vars.filecount++
                var filepath = `temp/${config.database}/file${currentcount}`
                fs.mkdirSync(`${filepath}`)
                fs.writeFileSync(`${filepath}/generated.txt`, resp.data.choices[0].message.content)
                await msg.reply({
                    files: [new Discord.AttachmentBuilder(`${filepath}/generated.txt`)]
                }).catch(() => { })
                fs.rmSync(`${filepath}`, { force: true, recursive: true })
            })
            return resp.data.choices[0].message.content
        }
    },
    help: {
        name: 'alchat/angryluigichat <message>',
        value: 'Chat with Angry Luigi!'
    },
    cooldown: 2000,
    type: 'Angry Luigi'
}
