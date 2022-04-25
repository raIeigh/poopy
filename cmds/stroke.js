module.exports = {
  name: ['stroke', 'gibberish'],
  execute: async function (msg, args) {
    let poopy = this

    msg.channel.sendTyping().catch(() => { })
    var saidMessage = args.join(' ').substring(args[0].length + 1)
    if (args[1] === undefined) {
      msg.channel.send('What is the message?!').catch(() => { })
      msg.channel.sendTyping().catch(() => { })
      return;
    };
    msg.channel.send({
      content: poopy.functions.gibberish(saidMessage),
      allowedMentions: {
        parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
      }
    }).catch(() => { })
    msg.channel.sendTyping().catch(() => { })
  },
  help: {
    name: 'stroke/gibberish <message>',
    value: 'teral stroket  kknerhxtiarhxtlo k'
  },
  cooldown: 2500,
  type: 'Text'
}