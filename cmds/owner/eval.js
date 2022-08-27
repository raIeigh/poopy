module.exports = {
    name: ['eval', 'execute'],
    args: [{"name":"code","required":false,"specifarg":false,"orig":"{code}"}],
    execute: async function (msg, args, opts) {
        let poopy = this

        with (poopy) {
            var ownerid = (config.ownerids.find(id => id == msg.author.id));
            if (ownerid === undefined && !opts.ownermode) {
                await msg.reply('Owner only!').catch(() => { })
                return
            }
            var saidMessage = args.slice(1).join(' ')
            var no = config.illKillYouIfYouUseEval.find(id => id === msg.guild.id || saidMessage.includes(id))
            if (no) {
                await msg.reply('<:YouIdiot:735259116737658890>').catch(() => { })
                return
            }
            try {
                var evalMessage = await eval(saidMessage)

                if (typeof (evalMessage) !== 'string') evalMessage = modules.util.inspect(evalMessage)

                evalMessage = evalMessage.match(/[\s\S]{1,2000}/g)

                for (var i in evalMessage) {
                    if (tempdata[msg.guild.id][msg.channel.id]['shut']) break
                    var ev = evalMessage[i]
                    await msg.channel.send({
                        content: ev,
                        allowedMentions: {
                            parse: ((!msg.member.permissihas('ADMINISTRATOR') && !msg.member.permissihas('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                        }
                    }).catch(async () => {
                        await msg.channel.send('​').catch(() => { })
                        return
                    })
                }
            } catch (error) {
                await msg.channel.send({
                    content: error.message,
                    allowedMentions: {
                        parse: ((!msg.member.permissihas('ADMINISTRATOR') && !msg.member.permissihas('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                    }
                }).catch(() => { })
                return
            }
        }
    },
    help: {
        name: 'eval/execute {code}',
        value: 'Evaluation command. (pretty much execute the code you want)'
    },
    raw: true,
    type: 'Owner'
}