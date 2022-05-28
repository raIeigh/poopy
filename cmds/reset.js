module.exports = {
    name: ['reset', 'restart', 'reboot'],
    execute: async function (msg) {
        let poopy = this

        var ownerid = poopy.config.ownerids.find(id => id == msg.author.id);
        if (ownerid === undefined && !opts.ownermode) {
            await msg.channel.send('Owner only!').catch(() => { })
            return
        } else {
            var config = poopy.config
            var TOKEN = poopy.__TOKEN

            await msg.channel.send('The chorizo slice').catch(() => { })
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