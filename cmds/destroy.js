module.exports = {
    name: ['destroy', 'kill', 'shutdown'],
    execute: async function (msg) {
        let poopy = this

        var ownerid = poopy.config.ownerids.find(id => id == msg.author.id);
        if (ownerid === undefined) {
            msg.channel.send('Owner only!').catch(() => { })
            return
        } else {
            await msg.channel.send('The salami lid').catch(() => { })
            clearInterval(poopy.vars.statusInterval)
            delete poopy.vars.statusInterval
            clearInterval(poopy.vars.saveInterval)
            delete poopy.vars.saveInterval
            poopy.bot.destroy()
            delete poopy.data
            delete poopy.tempdata
            for (var type in poopy.functions.globalData()) delete poopy.functions.globalData()[type]
        };
    },
    help: { name: 'destroy/kill/shutdown', value: 'Causes Poopy to shutdown.' },
    type: 'Owner'
}