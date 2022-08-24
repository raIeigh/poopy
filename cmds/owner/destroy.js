module.exports = {
    name: ['destroy', 'shutdown'],
    args: [],
    execute: async function (msg, _, opts) {
        let poopy = this

        var ownerid = poopy.config.ownerids.find(id => id == msg.author.id);
        if (ownerid === undefined && !opts.ownermode) {
            await msg.reply('Owner only!').catch(() => { })
            return
        }

        var confirm = await poopy.functions.yesno(msg.channel, 'are you sure about killing me', msg.member, undefined, msg).catch(() => { })
        if (!confirm) return

        await msg.reply('The salami lid').catch(() => { })
        await poopy.destroy(true)
        if (poopy.config.quitOnDestroy) process.exit()
    },
    help: { name: 'destroy/shutdown', value: 'Causes Poopy to shutdown.' },
    type: 'Owner'
}