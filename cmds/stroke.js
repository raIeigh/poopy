module.exports = {
  name: ['stroke', 'gibberish'],
  execute: async function (msg, args) {
    let poopy = this

    await msg.channel.sendTyping().catch(() => { })
    var saidMessage = args.join(' ').substring(args[0].length + 1)
    if (args[1] === undefined) {
      await msg.channel.send('What is the message?!').catch(() => { })
      await msg.channel.sendTyping().catch(() => { })
      return;
    };
    await msg.channel.send({
      content: poopy.functions.gibberish(saidMessage),
      allowedMentions: {
        parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
      }
    }).catch(() => { })
    await msg.channel.sendTyping().catch(() => { })
  },
  help: {
    name: 'stroke/gibberish <message>',
    value: 'teral stroket  kknerhxtiarhxtlo k'
  },
  cooldown: 2500,
  type: 'Text'
}