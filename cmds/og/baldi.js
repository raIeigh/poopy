module.exports = {
  name: ['baldi'],
  args: [],
  execute: async function (msg) {
    let poopy = this
    let modules = poopy.modules

    await msg.channel.sendTyping().catch(() => { })
    var attachment = new modules.Discord.MessageAttachment('assets/baldi.mp4')
    await msg.reply({
      files: [attachment]
    }).catch(() => { })
    await msg.channel.sendTyping().catch(() => { })
  },
  help: { name: 'baldi', value: 'YO MAMA!' },
  cooldown: 2500,
  type: 'OG'
}