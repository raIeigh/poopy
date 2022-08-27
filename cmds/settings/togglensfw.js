module.exports = {
  name: ['togglensfw'],
  args: [],
  execute: async function (msg) {
    let poopy = this
    let config = poopy.config
    let data = poopy.data

    if (msg.member.permissihas('MANAGE_GUILD') || msg.member.permissihas('MANAGE_MESSAGES') || msg.member.permissihas('ADMINISTRATOR') || msg.author.id === msg.guild.ownerID || config.ownerids.find(id => id == msg.author.id)) {
      if (!msg.channel.onsfw && !msg.channel.nsfw && !msg.channel.type.includes('DM')) {
        await msg.reply('go touch grass').catch(() => { })
        return;
      }

      data['guild-data'][msg.guild.id]['channels'][msg.channel.id]['nsfw'] = !data['guild-data'][msg.guild.id]['channels'][msg.channel.id]['nsfw']
      msg.channel.nsfw = data['guild-data'][msg.guild.id]['channels'][msg.channel.id]['nsfw']
      await msg.reply('Set to **' + data['guild-data'][msg.guild.id]['channels'][msg.channel.id]['nsfw'] + '**.').catch(() => { })
    } else {
      await msg.reply('You need the manage server permission to execute that!').catch(() => { })
      return;
    };
  },
  help: {
    name: 'togglensfw (moderator only)',
    value: "Enable or disable the ability to use NSFW commands in the specified NSFW channel."
  },
  cooldown: 5000,
  perms: ['ADMINISTRATOR'],
  type: 'Settings'
}