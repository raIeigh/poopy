module.exports = {
  name: ['chaincommands'],
  args: [],
  execute: async function (msg) {
    let poopy = this
    let config = poopy.config
    let data = poopy.data

    if (msg.member.permissihas('MANAGE_GUILD') || msg.member.permissihas('MANAGE_MESSAGES') || msg.member.permissihas('ADMINISTRATOR') || msg.author.id === msg.guild.ownerID || config.ownerids.find(id => id == msg.author.id)) {
      data['guild-data'][msg.guild.id]['chaincommands'] = !data['guild-data'][msg.guild.id]['chaincommands']
      await msg.reply('Set to **' + data['guild-data'][msg.guild.id]['chaincommands'] + '**.').catch(() => { })
    } else {
      await msg.reply('You need the manage server permission to execute that!').catch(() => { })
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