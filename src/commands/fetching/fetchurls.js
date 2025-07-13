module.exports = {
  name: ['fetchurls', 'geturls'],
  args: [{"name":"message","required":true,"specifarg":false,"orig":"<message>"}],
  execute: async function (msg, args) {
    let poopy = this
    let { Discord, DiscordTypes } = poopy.modules
    let { getUrls } = poopy.functions

    await msg.channel.sendTyping().catch(() => { })
    var attachments = []
    msg.attachments.forEach(attachment => {
      attachments.push(new Discord.AttachmentBuilder(attachment.url))
    });
    if (args[1] === undefined && attachments.length <= 0) {
      await msg.reply('What are the URLs to fetch?!').catch(() => { })
      return;
    };
    var urls = await getUrls(msg).catch(() => { }) ?? []
    if (!msg.nosend) await msg.reply({
      allowedMentions: {
        parse: ((!msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.Administrator) && !msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.MentionEveryone) && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
      },
      content: urls.join('\n') || 'No URLs fetched.'
    }).catch(() => { })
    return urls.join('\n') || 'No URLs fetched.'
  },
  help: {
    name: 'fetchurls/geturls <message>',
    value: 'Fetches the file URLs in the message and returns them.'
  },
  cooldown: 2500,
  type: 'Fetching'
}