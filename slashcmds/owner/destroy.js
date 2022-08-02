module.exports = {
    name: ['destroy', 'kill', 'shutdown'],
    execute: async function (msg, _, opts) {
        let poopy = this

        var ownerid = poopy.config.ownerids.find(id => id == msg.author.id);
        if (ownerid === undefined && !opts.ownermode) {
            await msg.channel.send('Owner only!').catch(() => { })
            return
        } else {
            var confirm = await poopy.functions.yesno(msg.channel, 'are you sure about killing me', msg.member).catch(() => { })
            if (!confirm) return

            await msg.channel.send('The salami lid').catch(() => { })
            await poopy.destroy(true)
            if (poopy.config.quitOnDestroy) process.exit()
        };
    },
    help: { name: 'destroy/kill/shutdown', value: 'Causes Poopy to shutdown.' },
    type: 'Owner'
}