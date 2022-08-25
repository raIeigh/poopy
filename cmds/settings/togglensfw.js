module.exports = {
  name: ['togglensfw'],
  args: [],
  execute: async function (msg) {
    let poopy = this

    if (msg.member.permissions.has('MANAGE_GUILD') || msg.member.permissions.has('MANAGE_MESSAGES') || msg.member.permissions.has('ADMINISTRATOR') || msg.author.id === msg.guild.ownerID || poopy.config.ownerids.find(id => id == msg.author.id)) {
      if (!msg.channel.onsfw && !msg.channel.nsfw && !msg.channel.type.includes('DM')) {
        await msg.reply('go touch grass').catch(() => { })
        return;
      }

      poopy.data['guild-data'][msg.guild.id]['channels'][msg.channel.id]['nsfw'] = !poopy.data['guild-data'][msg.guild.id]['channels'][msg.channel.id]['nsfw']
      msg.channel.nsfw = poopy.data['guild-data'][msg.guild.id]['channels'][msg.channel.id]['nsfw']
      await msg.reply('Set to **' + poopy.data['guild-data'][msg.guild.id]['channels'][msg.channel.id]['nsfw'] + '**.').catch(() => { })
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