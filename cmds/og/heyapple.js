module.exports = {
  name: ['heyapple'],
  args: [],
  execute: async function (msg) {
    let poopy = this
    let modules = poopy.modules

    await msg.channel.sendTyping().catch(() => { })
    var attachment = new modules.Discord.MessageAttachment('assets/heyapple.mp4')
    await msg.reply({
      files: [attachment]
    }).catch(() => { })
    await msg.channel.sendTyping().catch(() => { })
  },
  help: { name: 'heyapple', value: 'Try and hit me if you’re able.' },
  cooldown: 2500,
  type: 'OG'
}