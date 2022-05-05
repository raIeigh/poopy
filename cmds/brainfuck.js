module.exports = {
  name: ['brainfuck', 'bf'],
  execute: async function (msg, args) {
    let poopy = this

    msg.channel.sendTyping().catch(() => { })
    var saidMessage = args.join(' ').substring(args[0].length + 1)
    if (args[1] === undefined) {
      msg.channel.send('What is the code to compile?!').catch(() => { })
      msg.channel.sendTyping().catch(() => { })
      return;
    };
    var compiled = await poopy.functions.brainfuck(saidMessage)
    await msg.channel.send({
      content: compiled || '​',
      allowedMentions: {
        parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
      }
    }).catch(() => { })
    msg.channel.sendTyping().catch(() => { })
  },
  help: {
    name: 'brainfuck/bf <code>',
    value: 'Compiles the Brainfuck code supplied.'
  },
  cooldown: 2500,
  type: 'Text'
}