module.exports = {
  name: ['heyapple'],
  args: [],
  execute: async function (msg) {
    let poopy = this
    let { sendFile } = poopy.functions
    let { Discord } = poopy.modules

    await msg.channel.sendTyping().catch(() => { })
    var attachment = new Discord.AttachmentBuilder('assets/video/heyapple.mp4')
    if (msg.nosend) return await sendFile(msg, 'assets/video', 'heyapple.mp4', { keep: true })
    await msg.reply({
      files: [attachment]
    }).catch(() => { })
  },
  help: { name: 'heyapple', value: 'Try and hit me if you’re able.' },
  cooldown: 2500,
  type: 'OG'
}