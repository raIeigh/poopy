module.exports = {
  name: ['brainfuck', 'bf'],
  execute: async function (msg, args) {
    let poopy = this

    await msg.channel.sendTyping().catch(() => { })
    var saidMessage = args.slice(1).join(' ')
    if (args[1] === undefined) {
      await msg.channel.send('What is the code to compile?!').catch(() => { })
      await msg.channel.sendTyping().catch(() => { })
      return;
    };
    var compiled = await poopy.functions.brainfuck(saidMessage)
    await msg.channel.send({
      content: compiled || '​',
      allowedMentions: {
        parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
      }
    }).catch(() => { })
    await msg.channel.sendTyping().catch(() => { })
  },
  help: {
    name: 'brainfuck/bf <code>',
    value: 'Compiles the Brainfuck code supplied.'
  },
  cooldown: 2500,
  type: 'Text'
}