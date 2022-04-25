module.exports = {
  name: ['chaincommands'],
  execute: async function (msg) {
    let poopy = this

    if (msg.member.permissions.has('MANAGE_GUILD') || msg.member.roles.cache.find(role => role.name.match(/mod|dev|admin|owner|creator|founder|staff/ig)) || msg.member.permissions.has('ADMINISTRATOR') || msg.author.id === msg.guild.ownerID || poopy.config.ownerids.find(id => id == msg.author.id)) {
      poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['chaincommands'] = !poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['chaincommands']
      msg.channel.send('Set to **' + poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['chaincommands'] + '**.').catch(() => { })
    } else {
      msg.channel.send('You need to be an administrator to execute that!').catch(() => { })
      return;
    };
  },
  help: {
    name: 'chaincommands (admin only)',
    value: "Enable or disable the ability to chain commands, if you don't want the chat to get spammy of course."
  },
  cooldown: 5000,
  perms: ['ADMINISTRATOR'],
  type: 'Settings'
}