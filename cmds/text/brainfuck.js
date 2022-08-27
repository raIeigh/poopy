module.exports = {
  name: ['brainfuck', 'bf'],
  args: [{"name":"code","required":true,"specifarg":false,"orig":"<code>"}],
  execute: async function (msg, args) {
    let poopy = this
    let { brainfuck } = poopy.functions

    await msg.channel.sendTyping().catch(() => { })
    var saidMessage = args.slice(1).join(' ')
    if (args[1] === undefined) {
      await msg.reply('What is the code to compile?!').catch(() => { })
      await msg.channel.sendTyping().catch(() => { })
      return;
    };
    var compiled = await brainfuck(saidMessage)
    await msg.reply({
      content: compiled || '​',
      allowedMentions: {
        parse: ((!msg.member.permissihas('ADMINISTRATOR') && !msg.member.permissihas('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
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