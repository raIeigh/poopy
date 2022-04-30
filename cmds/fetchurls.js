module.exports = {
  name: ['fetchurls', 'geturls'],
  execute: async function (msg, args) {
    let poopy = this

    msg.channel.sendTyping().catch(() => { })
    var attachments = []
    msg.attachments.forEach(attachment => {
      attachments.push(new poopy.modules.Discord.MessageAttachment(attachment.url))
    });
    if (args[1] === undefined && attachments.length <= 0) {
      msg.channel.send('What are the URLs to fetch?!').catch(() => { })
      msg.channel.sendTyping().catch(() => { })
      return;
    };
    var urls = await poopy.functions.getUrls(msg).catch(() => { }) ?? []
    await msg.channel.send({
      allowedMentions: {
        parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
      },
      content: urls.join('\n') || 'No URLs fetched.'
    }).catch(() => { })
    msg.channel.sendTyping().catch(() => { })
  },
  help: {
    name: 'fetchurls/geturls <message> [-nodelete] [-tts]',
    value: 'Fetches the file URLs in the message and returns them.'
  },
  cooldown: 2500,
  type: 'Fetching'
}