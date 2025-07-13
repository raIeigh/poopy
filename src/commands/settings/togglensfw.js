module.exports = {
  name: ['togglensfw'],
  args: [],
  execute: async function (msg) {
    let poopy = this
    let config = poopy.config
    let data = poopy.data
    let { DiscordTypes } = poopy.modules

    if (msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.ManageGuild) || msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.ManageMessages) || msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.Administrator) || msg.author.id === msg.guild.ownerID || config.ownerids.find(id => id == msg.author.id)) {
      if (
          (!msg.channel.onsfw && !msg.channel.nsfw && !(msg.channel.type == DiscordTypes.ChannelType.DM || msg.channel.type == DiscordTypes.ChannelType.GroupDM) && !data.guildData[msg.guild.id]['chaos']) ||
          (msg.channel.type == DiscordTypes.ChannelType.DM && msg.channel.recipient.id != msg.author.id)
      ) {
        await msg.reply('go touch grass').catch(() => { })
        return;
      }

      data.guildData[msg.guild.id]['channels'][msg.channel.id]['nsfw'] = !data.guildData[msg.guild.id]['channels'][msg.channel.id]['nsfw']
      msg.channel.nsfw = data.guildData[msg.guild.id]['channels'][msg.channel.id]['nsfw']
      if (!msg.nosend) await msg.reply(`Set to **${data.guildData[msg.guild.id]['channels'][msg.channel.id]['nsfw']}**.`).catch(() => { })
      return `Set to **${data.guildData[msg.guild.id]['channels'][msg.channel.id]['nsfw']}**.`
    } else {
      await msg.reply('You need to be a moderator to execute that!').catch(() => { })
      return;
    };
  },
  help: {
    name: 'togglensfw (moderator only)',
    value: "Enable or disable the ability to use NSFW commands in the specified NSFW channel, yup."
  },
  cooldown: 5000,
  perms: ['Administrator'],
  type: 'Settings'
}