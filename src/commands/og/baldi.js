module.exports = {
  name: ['baldi'],
  args: [],
  execute: async function (msg) {
    let poopy = this
    let { sendFile } = poopy.functions
    let { Discord } = poopy.modules

    await msg.channel.sendTyping().catch(() => { })
    var attachment = new Discord.AttachmentBuilder('assets/video/baldi.mp4')
    if (msg.nosend) return await sendFile(msg, 'assets/video', 'baldi.mp4', { keep: true })
    await msg.reply({
      files: [attachment]
    }).catch(() => { })
  },
  help: { name: 'baldi', value: 'YO MAMA!' },
  cooldown: 2500,
  type: 'OG'
}