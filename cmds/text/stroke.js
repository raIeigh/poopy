module.exports = {
  name: ['stroke', 'gibberish'],
  args: [{"name":"message","required":true,"specifarg":false,"orig":"<message>"}],
  execute: async function (msg, args) {
    let poopy = this

    await msg.channel.sendTyping().catch(() => { })
    var saidMessage = args.slice(1).join(' ')
    if (args[1] === undefined) {
      await msg.reply('What is the message?!').catch(() => { })
      await msg.channel.sendTyping().catch(() => { })
      return;
    };
    await msg.reply({
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