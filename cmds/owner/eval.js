module.exports = {
    name: ['eval', 'execute'],
    args: [{"name":"code","required":false,"specifarg":false,"orig":"{code}"}],
    execute: async function (msg, args, opts) {
        let poopy = this

        var ownerid = (poopy.config.ownerids.find(id => id == msg.author.id));
        if (ownerid === undefined && !opts.ownermode) {
            await msg.channel.send('Owner only!').catch(() => { })
            return
        }
        var saidMessage = args.slice(1).join(' ')
        var no = poopy.config.illKillYouIfYouUseEval.find(id => id === msg.guild.id || saidMessage.includes(id))
        if (no) {
            await msg.channel.send('<:YouIdiot:735259116737658890>').catch(() => { })
            return
        }
        try {
            var evalMessage = await eval(saidMessage)

            if (typeof (evalMessage) !== 'string') evalMessage = poopy.modules.util.inspect(evalMessage)

            evalMessage = evalMessage.match(/[\s\S]{1,2000}/g)

            for (var i in evalMessage) {
                if (poopy.tempdata[msg.guild.id][msg.channel.id]['shut']) break
                var ev = evalMessage[i]
                await poopy.functions.waitMessageCooldown()
                await msg.channel.send({
                    content: ev,
                    allowedMentions: {
                        parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
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
                    parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                }
            }).catch(() => { })
            return
        }
    },
    help: {
        name: 'eval/execute {code}',
        value: 'Evaluation command. (pretty much execute the code you want)'
    },
    type: 'Owner'
}