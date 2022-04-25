module.exports = {
  name: ['reset', 'restart', 'reboot'],
  execute: async function (msg) {
    let poopy = this

    var ownerid = poopy.config.ownerids.find(id => id == msg.author.id);
    if (ownerid === undefined) {
      msg.channel.send('Owner only!').catch(() => { })
      return
    } else {
      await msg.channel.send('The chorizo slice').catch(() => { })
      clearInterval(poopy.vars.statusInterval)
      delete poopy.vars.statusInterval
      clearInterval(poopy.vars.saveInterval)
      delete poopy.vars.saveInterval
      poopy.bot.destroy()
      delete poopy.data[poopy.config.mongodatabase]
      poopy.functions.execPromise('node .')
    };
  },
  help: { name: 'reset/restart/reboot', value: 'Resets Poopy.' },
  cooldown: 60000,
  type: 'Owner'
}