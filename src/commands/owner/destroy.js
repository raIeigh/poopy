module.exports = {
    name: ['destroy', 'shutdown'],
    args: [],
    execute: async function (msg, _, opts) {
        let poopy = this
        let config = poopy.config
        let { yesno } = poopy.functions

        var ownerid = config.ownerids.find(id => id == msg.author.id);
        if (ownerid === undefined && !opts.ownermode) {
            await msg.reply('Owner only!').catch(() => { })
            return
        }

        var confirm = await yesno(msg.channel, 'are you sure about killing me', msg.member, undefined, msg).catch(() => { })
        if (!confirm) return

        await msg.reply('The salami lid').catch(() => { })
        await poopy.destroy(true)
        if (config.quitOnDestroy) process.exit()
    },
    help: { name: 'destroy/shutdown', value: 'Causes Poopy to shutdown.' },
    type: 'Owner'
}