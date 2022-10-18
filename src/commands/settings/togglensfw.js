module.exports = {
  name: ['togglensfw'],
  args: [],
  execute: async function (msg) {
    let poopy = this
    let config = poopy.config
    let data = poopy.data

    if (msg.member.permissions.has('ManageGuild') || msg.member.permissions.has('ManageMessages') || msg.member.permissions.has('Administrator') || msg.author.id === msg.guild.ownerID || config.ownerids.find(id => id == msg.author.id)) {
      if (
          (!msg.channel.onsfw && !msg.channel.nsfw && !msg.channel.type.includes('DM') && !data['guildData'][msg.guild.id]['chaos']) ||
          (msg.channel.type === 'DM' && msg.channel.recipient.id != msg.author.id)
      ) {
        await msg.reply('go touch grass').catch(() => { })
        return;
      }

      data['guildData'][msg.guild.id]['channels'][msg.channel.id]['nsfw'] = !data['guildData'][msg.guild.id]['channels'][msg.channel.id]['nsfw']
      msg.channel.nsfw = data['guildData'][msg.guild.id]['channels'][msg.channel.id]['nsfw']
      await msg.reply('Set to **' + data['guildData'][msg.guild.id]['channels'][msg.channel.id]['nsfw'] + '**.').catch(() => { })
    } else {
      await msg.reply('You need to be a moderator to execute that!').catch(() => { })
      return;
    };
  },
  help: {
    name: 'togglensfw (moderator only)',
    value: "Enable or disable the ability to use NSFW commands in the specified NSFW channel."
  },
  cooldown: 5000,
  perms: ['Administrator'],
  type: 'Settings'
}