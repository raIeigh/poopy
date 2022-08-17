module.exports = {
  name: ['chaincommands'],
  args: [],
  execute: async function (msg) {
    let poopy = this

    if (msg.member.permissions.has('MANAGE_GUILD') || msg.member.permissions.has('MANAGE_MESSAGES') || msg.member.permissions.has('ADMINISTRATOR') || msg.author.id === msg.guild.ownerID || poopy.config.ownerids.find(id => id == msg.author.id)) {
      poopy.data['guild-data'][msg.guild.id]['chaincommands'] = !poopy.data['guild-data'][msg.guild.id]['chaincommands']
      await msg.channel.send('Set to **' + poopy.data['guild-data'][msg.guild.id]['chaincommands'] + '**.').catch(() => { })
    } else {
      await msg.channel.send('You need the manage server permission to execute that!').catch(() => { })
      return;
    };
  },
  help: {
    name: 'chaincommands (moderator only)',
    value: "Enable or disable the ability to chain commands, if you don't want the chat to get spammy of course."
  },
  cooldown: 5000,
  perms: ['ADMINISTRATOR'],
  type: 'Settings'
}