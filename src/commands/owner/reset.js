module.exports = {
    name: ['reset', 'restart', 'reboot'],
    args: [],
    execute: async function (msg, _, opts) {
        let poopy = this
        let config = poopy.config
        let TOKEN = poopy.__TOKEN
        let { yesno } = poopy.functions

        var ownerid = config.ownerids.find(id => id == msg.author.id);
        if (ownerid === undefined && !opts.ownermode) {
            await msg.reply('Owner only!').catch(() => { })
            return
        } else {
            var confirm = msg.nosend || await yesno(msg.channel, 'are you sure about retarding me', msg.member, undefined, msg).catch(() => { })
            if (!confirm) return

            if (!msg.nosend) await msg.reply('The chorizo slice').catch(() => { })
            await poopy.destroy()

            var Poopy = require('../poopy')
            poopy = new Poopy(config)
            await poopy.start(TOKEN)
        };
    },
    help: { name: 'reset/restart/reboot', value: 'Resets Poopy.' },
    cooldown: 60000,
    type: 'Owner'
}